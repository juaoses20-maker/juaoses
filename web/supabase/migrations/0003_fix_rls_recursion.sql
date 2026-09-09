-- ARREGLO: la política m_admin de "memberships" se consultaba a sí misma
-- => Postgres lanza "infinite recursion detected in policy for relation memberships"
-- y NINGUNA lectura de membresías funciona (la app no encontraba la empresa recién creada).
-- Solución: políticas de memberships sin recursión + funciones SECURITY DEFINER para el resto.

-- 1) Quitar la política recursiva
drop policy if exists m_admin on public.memberships;

-- 2) Helpers que leen memberships SIN disparar RLS (evita la recursión)
create or replace function public.is_company_member(p_company uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where company_id = p_company and user_id = (select auth.uid())
  );
$$;
grant execute on function public.is_company_member(uuid) to authenticated;

create or replace function public.is_company_admin(p_company uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where company_id = p_company
      and user_id = (select auth.uid())
      and role in ('owner','admin')
  );
$$;
grant execute on function public.is_company_admin(uuid) to authenticated;

-- 3) memberships: SELECT propio (no recursivo) + escritura solo para admins
drop policy if exists m_select on public.memberships;
create policy m_select on public.memberships for select to authenticated
  using ( user_id = (select auth.uid()) );
create policy m_insert on public.memberships for insert to authenticated
  with check ( public.is_company_admin(company_id) );
create policy m_update on public.memberships for update to authenticated
  using ( public.is_company_admin(company_id) )
  with check ( public.is_company_admin(company_id) );
create policy m_delete on public.memberships for delete to authenticated
  using ( public.is_company_admin(company_id) );

-- 4) companies
drop policy if exists c_select on public.companies;
drop policy if exists c_update on public.companies;
create policy c_select on public.companies for select to authenticated
  using ( public.is_company_member(id) );
create policy c_update on public.companies for update to authenticated
  using ( public.is_company_admin(id) )
  with check ( public.is_company_admin(id) );

-- 5) resto de tablas de datos: acceso total para miembros de esa empresa
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'projects','crews','crew_members','plans','plan_marks',
    'tickets811','production_entries','photos'
  ] loop
    execute format('drop policy if exists %1$s_rw on public.%1$s', tbl);
    execute format($f$
      create policy %1$s_rw on public.%1$s for all to authenticated
        using ( public.is_company_member(company_id) )
        with check ( public.is_company_member(company_id) );
    $f$, tbl);
  end loop;
end $$;

-- 6) Storage: mismas reglas por primer segmento del path = company_id
drop policy if exists storage_plans_rw on storage.objects;
drop policy if exists storage_photos_rw on storage.objects;
create policy storage_plans_rw on storage.objects for all to authenticated
  using ( bucket_id = 'plans' and public.is_company_member((split_part(name,'/',1))::uuid) )
  with check ( bucket_id = 'plans' and public.is_company_member((split_part(name,'/',1))::uuid) );
create policy storage_photos_rw on storage.objects for all to authenticated
  using ( bucket_id = 'photos' and public.is_company_member((split_part(name,'/',1))::uuid) )
  with check ( bucket_id = 'photos' and public.is_company_member((split_part(name,'/',1))::uuid) );

notify pgrst, 'reload schema';
