-- Clientes do assessor; cada linha pertence ao usuário autenticado que a criou
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  cpf text not null default '',
  email text not null default '',
  phone text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_user_id_idx on public.clients (user_id);

-- Dados financeiros mensais; um registro por cliente e mês (YYYY-MM)
create table public.month_data (
  client_id uuid not null references public.clients (id) on delete cascade,
  month_key text not null check (month_key ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  income jsonb not null default '{}'::jsonb,
  expenses jsonb not null default '{}'::jsonb,
  notes text not null default '',
  saved_at timestamptz not null default now(),
  primary key (client_id, month_key)
);

alter table public.clients enable row level security;
alter table public.month_data enable row level security;

revoke all on public.clients from anon;
revoke all on public.month_data from anon;
grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.month_data to authenticated;

create policy "clients_select_own" on public.clients for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "clients_insert_own" on public.clients for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "clients_update_own" on public.clients for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "clients_delete_own" on public.clients for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- month_data herda a posse do cliente ao qual pertence
create policy "month_data_select_own" on public.month_data for select
  to authenticated
  using (exists (
    select 1 from public.clients c
    where c.id = month_data.client_id and c.user_id = (select auth.uid())
  ));

create policy "month_data_insert_own" on public.month_data for insert
  to authenticated
  with check (exists (
    select 1 from public.clients c
    where c.id = month_data.client_id and c.user_id = (select auth.uid())
  ));

create policy "month_data_update_own" on public.month_data for update
  to authenticated
  using (exists (
    select 1 from public.clients c
    where c.id = month_data.client_id and c.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.clients c
    where c.id = month_data.client_id and c.user_id = (select auth.uid())
  ));

create policy "month_data_delete_own" on public.month_data for delete
  to authenticated
  using (exists (
    select 1 from public.clients c
    where c.id = month_data.client_id and c.user_id = (select auth.uid())
  ));
