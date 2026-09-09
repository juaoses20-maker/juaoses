-- Reaplica create_company y recarga el cache de la API (por si 0001 no lo dejó visible).
create or replace function public.create_company(
  p_name text,
  p_client text default null,
  p_location text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := (select auth.uid());
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'no autenticado';
  end if;
  insert into public.companies (name, client, location, created_by)
  values (p_name, p_client, p_location, v_uid)
  returning id into v_id;
  insert into public.memberships (company_id, user_id, role)
  values (v_id, v_uid, 'owner');
  return v_id;
end;
$$;

grant execute on function public.create_company(text, text, text) to authenticated;

-- Fuerza a la API de Supabase a releer las funciones nuevas.
notify pgrst, 'reload schema';
