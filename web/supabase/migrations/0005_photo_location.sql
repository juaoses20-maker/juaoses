-- Lugar escrito a mano para la foto (calle/cruce), además de las coordenadas GPS.
alter table public.photos
  add column if not exists location text;

notify pgrst, 'reload schema';
