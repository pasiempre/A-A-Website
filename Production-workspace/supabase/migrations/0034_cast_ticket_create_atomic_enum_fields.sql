-- Fix enum casts inside admin_create_ticket_atomic.

CREATE OR REPLACE FUNCTION public.admin_create_ticket_atomic(
  p_title text,
  p_address text,
  p_clean_type text,
  p_priority text,
  p_scope text,
  p_areas text[],
  p_assigned_week_start text,
  p_worker_id text,
  p_checklist_template_id text,
  p_created_by uuid
)
RETURNS TABLE(job_id uuid, assignment_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_job_id uuid;
  v_assignment_id uuid;
  v_template_id uuid;
  v_worker_id uuid;
BEGIN
  IF coalesce(trim(p_title), '') = '' OR coalesce(trim(p_address), '') = '' THEN
    RAISE EXCEPTION 'Title and address are required.';
  END IF;

  IF p_worker_id IS NOT NULL AND trim(p_worker_id) <> '' THEN
    v_worker_id := trim(p_worker_id)::uuid;
  END IF;

  IF p_checklist_template_id IS NOT NULL AND trim(p_checklist_template_id) <> '' THEN
    v_template_id := trim(p_checklist_template_id)::uuid;
  END IF;

  INSERT INTO public.jobs (
    title,
    address,
    clean_type,
    priority,
    scope,
    areas,
    assigned_week_start,
    checklist_template_id,
    status,
    created_by
  )
  VALUES (
    trim(p_title),
    trim(p_address),
    coalesce(nullif(trim(p_clean_type), ''), 'post_construction')::public.clean_type,
    coalesce(nullif(trim(p_priority), ''), 'normal')::public.job_priority,
    nullif(trim(coalesce(p_scope, '')), ''),
    coalesce(p_areas, ARRAY[]::text[]),
    CASE
      WHEN p_assigned_week_start IS NULL OR trim(p_assigned_week_start) = '' THEN NULL
      ELSE trim(p_assigned_week_start)::date
    END,
    v_template_id,
    'scheduled'::public.job_status,
    p_created_by
  )
  RETURNING id INTO v_job_id;

  IF v_worker_id IS NOT NULL THEN
    INSERT INTO public.job_assignments (
      job_id,
      employee_id,
      role,
      status,
      notification_status,
      assigned_by
    )
    VALUES (
      v_job_id,
      v_worker_id,
      'lead',
      'assigned',
      'pending',
      p_created_by
    )
    RETURNING id INTO v_assignment_id;
  END IF;

  IF v_template_id IS NOT NULL THEN
    INSERT INTO public.job_checklist_items (job_id, item_text, sort_order)
    SELECT v_job_id, cti.item_text, cti.sort_order
    FROM public.checklist_template_items cti
    WHERE cti.template_id = v_template_id
    ORDER BY cti.sort_order ASC;
  END IF;

  RETURN QUERY SELECT v_job_id, v_assignment_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_create_ticket_atomic(text, text, text, text, text, text[], text, text, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_ticket_atomic(text, text, text, text, text, text[], text, text, text, uuid) TO service_role;

NOTIFY pgrst, 'reload schema';
