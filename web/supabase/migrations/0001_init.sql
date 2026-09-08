-- EA Fiber Track — esquema inicial + RLS
-- Multi-empresa: cada fila cuelga de company_id; se ve solo si eres miembro de esa empresa.
-- Patrón RLS: (select auth.uid()) envuelto + columna de la política indexada (25 / 09).

-- ───────────────────────── helpers ─────────────────────────
create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ───────────────────────── companies + memberships ─────────────────────────
create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  client      text,
  location    text,
  created_by  uuid not null default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.memberships (
  company_id  uuid not null references public.companies(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'owner' check (role in ('owner','admin','member')),
  created_at  timestamptz not null default now(),
  primary key (company_id, user_id)
);
create index if not exists memberships_user_idx on public.memberships(user_id);

-- Crea una empresa y deja al usuario como owner (evita el huevo-y-la-gallina del INSERT con RLS).
create or replace function public.create_company(p_name text, p_client text default null, p_location text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_uid uuid := (select auth.uid()); v_id uuid;
begin
  if v_uid is null then raise exception 'no autenticado'; end if;
  insert into public.companies (name, client, location, created_by)
  values (p_name, p_client, p_location, v_uid) returning id into v_id;
  insert into public.memberships (company_id, user_id, role) values (v_id, v_uid, 'owner');
  return v_id;
end $$;
grant execute on function public.create_company(text, text, text) to authenticated;

-- ───────────────────────── projects ─────────────────────────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete cascade,
  name        text not null,
  client      text,
  location    text,
  status      text not null default 'activo',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_company_idx on public.projects(company_id);

-- ───────────────────────── crews ─────────────────────────
create table if not exists public.crews (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  name        text not null,
  color       text not null default '#e8590c',
  foreman     text,
  people      int not null default 0,
  equipment   text[] not null default '{}',
  last_seen   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists crews_company_idx on public.crews(company_id);
create index if not exists crews_project_idx on public.crews(project_id);

create table if not exists public.crew_members (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete cascade,
  crew_id     uuid not null references public.crews(id) on delete cascade,
  name        text not null
);
create index if not exists crew_members_crew_idx on public.crew_members(crew_id);
create index if not exists crew_members_company_idx on public.crew_members(company_id);

-- ───────────────────────── plans + marks ─────────────────────────
create table if not exists public.plans (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  project_id    uuid not null references public.projects(id) on delete cascade,
  name          text not null,
  storage_path  text,
  width         int,
  height        int,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists plans_project_idx on public.plans(project_id);
create index if not exists plans_company_idx on public.plans(company_id);

create table if not exists public.plan_marks (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete cascade,
  plan_id     uuid not null references public.plans(id) on delete cascade,
  kind        text not null check (kind in ('seg','pt')),
  geom        jsonb not null,
  activity    text not null,
  qty         numeric not null default 0,
  unit        text not null default 'ft',
  crew_id     uuid references public.crews(id) on delete set null,
  note        text,
  at          timestamptz not null default now()
);
create index if not exists plan_marks_plan_idx on public.plan_marks(plan_id);
create index if not exists plan_marks_company_idx on public.plan_marks(company_id);

-- ───────────────────────── tickets 811 ─────────────────────────
create table if not exists public.tickets811 (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  project_id    uuid not null references public.projects(id) on delete cascade,
  number        text not null,
  location      text,
  dig_start     date,
  expiration    date,
  life_days     int not null default 21,
  status_manual text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists tickets811_project_idx on public.tickets811(project_id);
create index if not exists tickets811_company_idx on public.tickets811(company_id);

-- ───────────────────────── production ─────────────────────────
create table if not exists public.production_entries (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  project_id    uuid not null references public.projects(id) on delete cascade,
  crew_id       uuid references public.crews(id) on delete set null,
  activity      text not null,
  qty           numeric not null default 0,
  unit          text not null default 'ft',
  sta_from      text,
  sta_to        text,
  ticket_number text,
  plan_mark_id  uuid references public.plan_marks(id) on delete set null,
  note          text,
  at            timestamptz not null default now(),
  day           date not null default (now() at time zone 'utc')::date
);
create index if not exists prod_project_day_idx on public.production_entries(project_id, day desc);
create index if not exists prod_company_idx on public.production_entries(company_id);

-- ───────────────────────── photos ─────────────────────────
create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies(id) on delete cascade,
  project_id   uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  lat          double precision,
  lng          double precision,
  taken_at     timestamptz not null default now(),
  crew_id      uuid references public.crews(id) on delete set null,
  activity     text,
  ticket_id    uuid references public.tickets811(id) on delete set null
);
create index if not exists photos_project_idx on public.photos(project_id, taken_at desc);
create index if not exists photos_company_idx on public.photos(company_id);

-- ───────────────────────── updated_at triggers ─────────────────────────
do $$
declare t text;
begin
  foreach t in array array['companies','projects','crews','plans','tickets811'] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function private.set_updated_at()', t, t);
  end loop;
end $$;

-- ───────────────────────── RLS ─────────────────────────
alter table public.companies         enable row level security;
alter table public.memberships       enable row level security;
alter table public.projects          enable row level security;
alter table public.crews             enable row level security;
alter table public.crew_members      enable row level security;
alter table public.plans             enable row level security;
alter table public.plan_marks        enable row level security;
alter table public.tickets811        enable row level security;
alter table public.production_entries enable row level security;
alter table public.photos            enable row level security;

-- memberships: cada quien ve solo sus propias filas; owners/admins pueden agregar/quitar gente de su empresa
create policy m_select on public.memberships for select
  using ( user_id = (select auth.uid()) );
create policy m_admin on public.memberships for all
  using ( company_id in (select company_id from public.memberships where user_id = (select auth.uid()) and role in ('owner','admin')) )
  with check ( company_id in (select company_id from public.memberships where user_id = (select auth.uid()) and role in ('owner','admin')) );

-- companies: ves la empresa si eres miembro; la creas por la función create_company (no INSERT directo)
create policy c_select on public.companies for select
  using ( id in (select company_id from public.memberships where user_id = (select auth.uid())) );
create policy c_update on public.companies for update
  using ( id in (select company_id from public.memberships where user_id = (select auth.uid()) and role in ('owner','admin')) );

-- resto de tablas: acceso total si eres miembro de esa company_id
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'projects','crews','crew_members','plans','plan_marks',
    'tickets811','production_entries','photos'
  ] loop
    execute format($f$
      create policy %1$s_rw on public.%1$s for all
        using ( company_id in (select company_id from public.memberships where user_id = (select auth.uid())) )
        with check ( company_id in (select company_id from public.memberships where user_id = (select auth.uid())) );
    $f$, tbl);
  end loop;
end $$;

-- ───────────────────────── Storage: buckets privados + RLS por empresa ─────────────────────────
insert into storage.buckets (id, name, public)
values ('plans','plans',false), ('photos','photos',false)
on conflict (id) do nothing;

-- los archivos se guardan como  <company_id>/<...>  → el primer segmento del path es la company_id
create policy storage_plans_rw on storage.objects for all
  using (
    bucket_id = 'plans'
    and (split_part(name,'/',1))::uuid in (select company_id from public.memberships where user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'plans'
    and (split_part(name,'/',1))::uuid in (select company_id from public.memberships where user_id = (select auth.uid()))
  );

create policy storage_photos_rw on storage.objects for all
  using (
    bucket_id = 'photos'
    and (split_part(name,'/',1))::uuid in (select company_id from public.memberships where user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'photos'
    and (split_part(name,'/',1))::uuid in (select company_id from public.memberships where user_id = (select auth.uid()))
  );
