-- Suscripción por empresa (Stripe). Solo el webhook (service role, bypass RLS) escribe
-- estas columnas; los miembros de la empresa las leen a través del select ya existente
-- en `companies` (misma política de RLS por membership).
alter table public.companies
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status    text not null default 'none'
    check (subscription_status in ('none','trialing','active','past_due','canceled')),
  add column if not exists trial_ends_at           timestamptz,
  add column if not exists current_period_end      timestamptz;

create unique index if not exists companies_stripe_subscription_idx
  on public.companies (stripe_subscription_id) where stripe_subscription_id is not null;

-- Empresas que ya existían antes de Stripe (hoy solo la del dueño probando la app):
-- se dejan activas para no bloquearlas de golpe. De aquí en adelante, toda empresa
-- NUEVA nace en 'none' (el default de la columna) hasta que pase por el checkout.
update public.companies set subscription_status = 'active' where subscription_status = 'none';

-- Idempotencia del webhook: cada evento de Stripe se procesa una sola vez.
create table if not exists public.stripe_events (
  id          text primary key,
  created_at  timestamptz not null default now()
);
alter table public.stripe_events enable row level security;
-- Sin políticas: nadie con anon/authenticated puede leer ni escribir aquí — solo
-- el service role del webhook, que se salta RLS.

notify pgrst, 'reload schema';
