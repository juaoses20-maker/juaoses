-- Página del plano a la que corresponde el ticket 811 (texto libre: "3", "A-1", "Sheet 5"…).
alter table public.tickets811
  add column if not exists plan_page text;

notify pgrst, 'reload schema';
