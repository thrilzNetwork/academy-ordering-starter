-- Tabla de pedidos para el modo base de datos.
-- En Supabase: SQL Editor → pega esto → Run.
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  phone      text not null,
  delivery   text not null check (delivery in ('pickup', 'delivery')),
  address    text,
  notes      text,
  items      jsonb not null,
  total      numeric(10, 2) not null,
  status     text not null default 'nuevo' check (status in ('nuevo', 'preparando', 'listo', 'entregado', 'cancelado')),
  payment    text not null default 'simulado'
);

-- Seguridad: nadie entra a la tabla desde el navegador. Solo el servidor, con la clave secreta.
alter table public.orders enable row level security;
