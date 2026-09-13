-- Número de página del plano (PDF de varias hojas) al que pertenece la marca. 1 = plano de
-- una sola página o foto.
alter table public.plan_marks
  add column if not exists page int not null default 1;

notify pgrst, 'reload schema';
