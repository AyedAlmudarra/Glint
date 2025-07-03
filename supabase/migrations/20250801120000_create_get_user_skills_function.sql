DROP FUNCTION IF EXISTS get_user_skills(uuid);

create or replace function get_user_skills(p_user_id uuid)
returns table (
  id bigint,
  name text,
  description text,
  simulation_id bigint,
  simulation_title text
)
language sql
security definer
as $$
  select distinct
    s.id,
    s.name,
    s.description,
    sim.id as simulation_id,
    sim.title as simulation_title
  from skills s
  join task_skills ts on s.id = ts.skill_id
  join tasks t on ts.task_id = t.id
  join simulations sim on t.simulation_id = sim.id
  join user_task_progress utp on ts.task_id = utp.task_id
  where utp.user_id = p_user_id;
$$;