-- board_columns stores user-defined kanban columns (non-default ones)
-- The 3 default columns (todo, pending, completed) are hardcoded in the app
-- and are not stored here.

create table "public"."board_columns" (
  "id"         text not null,
  "user_id"    uuid not null references public.users(id) on delete cascade,
  "label"      text not null,
  "color_name" text not null default 'slate',
  "position"   integer not null default 0,
  "created_at" timestamp with time zone default current_timestamp
);

alter table "public"."board_columns" enable row level security;

create unique index board_columns_pkey on public.board_columns using btree (id, user_id);

alter table "public"."board_columns"
  add constraint "board_columns_pkey" primary key using index "board_columns_pkey";

-- RLS: users can only see and manage their own columns
create policy "board_columns_all"
  on "public"."board_columns"
  as permissive
  for all
  to public
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Grants
grant select, insert, update, delete on table "public"."board_columns" to anon;
grant select, insert, update, delete on table "public"."board_columns" to authenticated;
grant select, insert, update, delete on table "public"."board_columns" to service_role;
