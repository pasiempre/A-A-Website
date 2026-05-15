-- Harden launch employee flows:
-- 1. Employees must be able to read jobs through job_assignments, not only jobs.assigned_to.
-- 2. Profile self-updates must not allow role/is_active escalation through direct client writes.
-- 3. Employee photo metadata/storage writes must require assignment ownership.

DROP POLICY IF EXISTS jobs_assigned_read ON public.jobs;
CREATE POLICY jobs_assigned_read
ON public.jobs
FOR SELECT
TO authenticated
USING (
  assigned_to = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.job_assignments ja
    WHERE ja.job_id = jobs.id
      AND ja.employee_id = auth.uid()
  )
);

DROP POLICY IF EXISTS profiles_self_update ON public.profiles;

DROP POLICY IF EXISTS job_photos_uploader ON public.job_photos;
DROP POLICY IF EXISTS job_photos_employee_select_assigned ON public.job_photos;
DROP POLICY IF EXISTS job_photos_employee_insert_assigned ON public.job_photos;

CREATE POLICY job_photos_employee_select_assigned
ON public.job_photos
FOR SELECT
TO authenticated
USING (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.job_assignments ja
    WHERE ja.job_id = job_photos.job_id
      AND ja.employee_id = auth.uid()
  )
);

CREATE POLICY job_photos_employee_insert_assigned
ON public.job_photos
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.job_assignments ja
    WHERE ja.job_id = job_photos.job_id
      AND ja.employee_id = auth.uid()
      AND (
        job_photos.assignment_id IS NULL
        OR ja.id = job_photos.assignment_id
      )
  )
);

DROP POLICY IF EXISTS storage_admin_all_job_photos ON storage.objects;
DROP POLICY IF EXISTS storage_employee_insert_job_photos ON storage.objects;
DROP POLICY IF EXISTS storage_employee_select_job_photos ON storage.objects;

CREATE POLICY storage_admin_all_job_photos
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id IN ('job-photos', 'job-photos-spike')
  AND public.current_user_role() IN ('admin', 'owner')
)
WITH CHECK (
  bucket_id IN ('job-photos', 'job-photos-spike')
  AND public.current_user_role() IN ('admin', 'owner')
);

CREATE POLICY storage_employee_insert_job_photos
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'job-photos'
  AND EXISTS (
    SELECT 1
    FROM public.job_assignments ja
    WHERE ja.employee_id = auth.uid()
      AND ja.job_id::text = split_part(storage.objects.name, '/', 2)
  )
);

CREATE POLICY storage_employee_select_job_photos
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'job-photos'
  AND EXISTS (
    SELECT 1
    FROM public.job_assignments ja
    WHERE ja.employee_id = auth.uid()
      AND ja.job_id::text = split_part(storage.objects.name, '/', 2)
  )
);

NOTIFY pgrst, 'reload schema';
