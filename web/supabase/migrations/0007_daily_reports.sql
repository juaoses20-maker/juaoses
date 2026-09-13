-- Parte diario: un registro por proyecto y día que "cierra" la jornada.
-- Alimenta la racha de días seguidos (loop de retención, Regla 6).
create table if not exists public.daily_reports (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete cascade,
  project_id  uuid not null references public.projects(id) on delete cascade,
  day         date not null,
  note        text,
  closed_by   uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (project_id, day)
);
create index if not exists daily_reports_project_idx on public.daily_reports(project_id, day desc);
create index if not exists daily_reports_company_idx on public.daily_reports(company_id);

alter table public.daily_reports enable row level security;

create policy daily_reports_rw on public.daily_reports for all
  using ( company_id in (select company_id from public.memberships where user_id = (select auth.uid())) )
  with check ( company_id in (select company_id from public.memberships where user_id = (select auth.uid())) );

notify pgrst, 'reload schema';
