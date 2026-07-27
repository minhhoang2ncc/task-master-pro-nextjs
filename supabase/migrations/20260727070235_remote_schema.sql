drop extension if exists "pg_net";


  create table "public"."subtasks" (
    "id" uuid not null default gen_random_uuid(),
    "parent_task_id" uuid,
    "title" character varying(255) not null,
    "is_completed" boolean default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
      );


alter table "public"."subtasks" enable row level security;


  create table "public"."task_followers" (
    "task_id" uuid not null,
    "user_id" uuid not null
      );


alter table "public"."task_followers" enable row level security;


  create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying(255) not null,
    "description" text,
    "due_date" date,
    "priority" character varying(50) default 'Low'::character varying,
    "tags" jsonb[],
    "creator_id" uuid,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "status" character varying default 'Pending'::character varying
      );


alter table "public"."tasks" enable row level security;


  create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "display_name" character varying(255) not null,
    "email" character varying(255) not null,
    "password_hash" character varying(255) not null,
    "role" character varying(100),
    "avatar_url" text,
    "theme_preference" character varying(50) default 'Light Mode'::character varying,
    "browser_notifications" boolean default true,
    "email_notifications" boolean default true,
    "language_display" character varying(50) default 'English'::character varying,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX subtasks_pkey ON public.subtasks USING btree (id);

CREATE UNIQUE INDEX task_followers_pkey ON public.task_followers USING btree (task_id, user_id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."subtasks" add constraint "subtasks_pkey" PRIMARY KEY using index "subtasks_pkey";

alter table "public"."task_followers" add constraint "task_followers_pkey" PRIMARY KEY using index "task_followers_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."subtasks" add constraint "subtasks_parent_task_id_fkey" FOREIGN KEY (parent_task_id) REFERENCES public.tasks(id) ON DELETE CASCADE not valid;

alter table "public"."subtasks" validate constraint "subtasks_parent_task_id_fkey";

alter table "public"."task_followers" add constraint "task_followers_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_followers" validate constraint "task_followers_task_id_fkey";

alter table "public"."task_followers" add constraint "task_followers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."task_followers" validate constraint "task_followers_user_id_fkey";

alter table "public"."tasks" add constraint "tasks_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."tasks" validate constraint "tasks_creator_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

grant delete on table "public"."subtasks" to "anon";

grant insert on table "public"."subtasks" to "anon";

grant references on table "public"."subtasks" to "anon";

grant select on table "public"."subtasks" to "anon";

grant trigger on table "public"."subtasks" to "anon";

grant truncate on table "public"."subtasks" to "anon";

grant update on table "public"."subtasks" to "anon";

grant delete on table "public"."subtasks" to "authenticated";

grant insert on table "public"."subtasks" to "authenticated";

grant references on table "public"."subtasks" to "authenticated";

grant select on table "public"."subtasks" to "authenticated";

grant trigger on table "public"."subtasks" to "authenticated";

grant truncate on table "public"."subtasks" to "authenticated";

grant update on table "public"."subtasks" to "authenticated";

grant delete on table "public"."subtasks" to "service_role";

grant insert on table "public"."subtasks" to "service_role";

grant references on table "public"."subtasks" to "service_role";

grant select on table "public"."subtasks" to "service_role";

grant trigger on table "public"."subtasks" to "service_role";

grant truncate on table "public"."subtasks" to "service_role";

grant update on table "public"."subtasks" to "service_role";

grant delete on table "public"."task_followers" to "anon";

grant insert on table "public"."task_followers" to "anon";

grant references on table "public"."task_followers" to "anon";

grant select on table "public"."task_followers" to "anon";

grant trigger on table "public"."task_followers" to "anon";

grant truncate on table "public"."task_followers" to "anon";

grant update on table "public"."task_followers" to "anon";

grant delete on table "public"."task_followers" to "authenticated";

grant insert on table "public"."task_followers" to "authenticated";

grant references on table "public"."task_followers" to "authenticated";

grant select on table "public"."task_followers" to "authenticated";

grant trigger on table "public"."task_followers" to "authenticated";

grant truncate on table "public"."task_followers" to "authenticated";

grant update on table "public"."task_followers" to "authenticated";

grant delete on table "public"."task_followers" to "service_role";

grant insert on table "public"."task_followers" to "service_role";

grant references on table "public"."task_followers" to "service_role";

grant select on table "public"."task_followers" to "service_role";

grant trigger on table "public"."task_followers" to "service_role";

grant truncate on table "public"."task_followers" to "service_role";

grant update on table "public"."task_followers" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "all"
  on "public"."subtasks"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.tasks
  WHERE ((tasks.id = subtasks.parent_task_id) AND (tasks.creator_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.tasks
  WHERE ((tasks.id = subtasks.parent_task_id) AND (tasks.creator_id = auth.uid())))));



  create policy "Allow users to insert their own tasks"
  on "public"."tasks"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "all"
  on "public"."tasks"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) = creator_id))
with check ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "All commands"
  on "public"."users"
  as permissive
  for all
  to public
using ((auth.uid() = id))
with check ((auth.uid() = id));



  create policy "Allow users to create their own profile"
  on "public"."users"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Select"
  on "public"."users"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) = id));



