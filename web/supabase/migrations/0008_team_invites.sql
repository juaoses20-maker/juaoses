-- Invitar gente a la MISMA empresa (hoy cada correo nuevo crea la suya propia).
-- memberships.email queda guardado para poder mostrar el equipo sin tocar auth.users
-- (evita depender de la service_role key).
alter table public.memberships add column if not exists email text;

create table if not exists public.company_invites (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete cascade,
  email       text not null,
  role        text not null default 'member' check (role in ('member','admin')),
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null,
  unique (company_id, email)
);
create index if not exists company_invites_email_idx on public.company_invites (lower(email));
create index if not exists company_invites_company_idx on public.company_invites (company_id);

alter table public.company_invites enable row level security;

-- Solo owner/admin de la empresa gestionan sus invitaciones (mismo criterio que memberships).
create policy company_invites_rw on public.company_invites for all
  using ( company_id in (select company_id from public.memberships where user_id = (select auth.uid()) and role in ('owner','admin')) )
  with check ( company_id in (select company_id from public.memberships where user_id = (select auth.uid()) and role in ('owner','admin')) );

-- create_company: ahora también guarda el email del owner en su membership.
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
  v_email text := (select auth.jwt() ->> 'email');
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'no autenticado';
  end if;
  insert into public.companies (name, client, location, created_by)
  values (p_name, p_client, p_location, v_uid)
  returning id into v_id;
  insert into public.memberships (company_id, user_id, role, email)
  values (v_id, v_uid, 'owner', v_email);
  return v_id;
end;
$$;

grant execute on function public.create_company(text, text, text) to authenticated;

-- accept_invite: si el correo autenticado tiene una invitación pendiente, lo une a ESA
-- empresa (en vez de dejarlo crear la suya en /bienvenido). SECURITY DEFINER porque el
-- invitado todavía no es miembro de esa empresa (mismo problema del huevo-y-gallina que
-- create_company).
create or replace function public.accept_invite()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := (select auth.uid());
  v_email text := (select auth.jwt() ->> 'email');
  v_invite record;
begin
  if v_uid is null or v_email is null then
    return null;
  end if;

  select * into v_invite
  from public.company_invites
  where lower(email) = lower(v_email) and accepted_at is null
  order by created_at asc
  limit 1;

  if not found then
    return null;
  end if;

  if not exists (
    select 1 from public.memberships
    where company_id = v_invite.company_id and user_id = v_uid
  ) then
    insert into public.memberships (company_id, user_id, role, email)
    values (v_invite.company_id, v_uid, v_invite.role, v_email);
  end if;

  update public.company_invites
    set accepted_at = now(), accepted_by = v_uid
    where id = v_invite.id;

  return v_invite.company_id;
end;
$$;

grant execute on function public.accept_invite() to authenticated;

notify pgrst, 'reload schema';
