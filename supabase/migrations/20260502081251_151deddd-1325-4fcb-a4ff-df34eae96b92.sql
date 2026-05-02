-- ============ TEACHER ↔ AUTH USER LINK ============
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);

-- Helper function: get teacher record id for current user
CREATE OR REPLACE FUNCTION public.current_teacher_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.teachers WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ============ LEAD ENHANCEMENTS ============
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS course_interest text,
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Drop old staff view policy and recreate with teacher-scoped access
DROP POLICY IF EXISTS "Staff view leads" ON public.leads;
CREATE POLICY "Admins view all leads" ON public.leads
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers view assigned leads" ON public.leads
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'teacher'::app_role)
    AND assigned_to = public.current_teacher_id()
  );

DROP POLICY IF EXISTS "Admins update leads" ON public.leads;
CREATE POLICY "Admins update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers update assigned leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'teacher'::app_role)
    AND assigned_to = public.current_teacher_id()
  );

-- ============ LEAD NOTES ============
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  author_name text NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);

ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all notes" ON public.lead_notes
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers view notes on their leads" ON public.lead_notes
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'teacher'::app_role)
    AND EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_notes.lead_id AND l.assigned_to = public.current_teacher_id()
    )
  );

CREATE POLICY "Staff add notes" ON public.lead_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND (
      has_role(auth.uid(), 'admin'::app_role)
      OR (
        has_role(auth.uid(), 'teacher'::app_role)
        AND EXISTS (
          SELECT 1 FROM public.leads l
          WHERE l.id = lead_notes.lead_id AND l.assigned_to = public.current_teacher_id()
        )
      )
    )
  );

CREATE POLICY "Admins delete notes" ON public.lead_notes
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============ FAQS ============
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  display_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view visible faqs" ON public.faqs FOR SELECT TO anon, authenticated
  USING (visible = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert faqs" ON public.faqs FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update faqs" ON public.faqs FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete faqs" ON public.faqs FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
DROP TRIGGER IF EXISTS trg_faqs_updated_at ON public.faqs;
CREATE TRIGGER trg_faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ GALLERY ============
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  category text DEFAULT 'general',
  display_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view visible gallery" ON public.gallery FOR SELECT TO anon, authenticated
  USING (visible = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert gallery" ON public.gallery FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update gallery" ON public.gallery FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete gallery" ON public.gallery FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============ ANNOUNCEMENTS ============
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active announcements" ON public.announcements FOR SELECT TO anon, authenticated
  USING (active = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert announcements" ON public.announcements FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update announcements" ON public.announcements FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete announcements" ON public.announcements FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
DROP TRIGGER IF EXISTS trg_announcements_updated_at ON public.announcements;
CREATE TRIGGER trg_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SITE CONTENT (key/value blocks) ============
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key text NOT NULL UNIQUE,
  title text,
  body text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert site content" ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update site content" ON public.site_content FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete site content" ON public.site_content FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
DROP TRIGGER IF EXISTS trg_site_content_updated_at ON public.site_content;
CREATE TRIGGER trg_site_content_updated_at BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, read, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());
CREATE POLICY "System inserts notifications" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE TO authenticated
  USING (recipient_id = auth.uid());

-- ============ TRIGGER: notify admins on new lead, teacher on assignment ============
CREATE OR REPLACE FUNCTION public.notify_on_new_lead()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  admin_user uuid;
BEGIN
  FOR admin_user IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications (recipient_id, type, title, body, link)
    VALUES (admin_user, 'new_lead', 'New enquiry: ' || NEW.name,
            COALESCE(NEW.exam, '') || ' · Class ' || COALESCE(NEW.student_class, ''),
            '/admin?tab=leads&lead=' || NEW.id::text);
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_lead ON public.leads;
CREATE TRIGGER trg_notify_new_lead AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_new_lead();

CREATE OR REPLACE FUNCTION public.notify_on_lead_assignment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  teacher_user uuid;
  teacher_name_val text;
BEGIN
  IF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    SELECT user_id, name INTO teacher_user, teacher_name_val
      FROM public.teachers WHERE id = NEW.assigned_to;
    IF teacher_user IS NOT NULL THEN
      INSERT INTO public.notifications (recipient_id, type, title, body, link)
      VALUES (teacher_user, 'lead_assigned', 'New lead assigned: ' || NEW.name,
              'Class ' || COALESCE(NEW.student_class, '') || ' · ' || COALESCE(NEW.exam, ''),
              '/admin?tab=my-leads&lead=' || NEW.id::text);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_lead_assignment ON public.leads;
CREATE TRIGGER trg_notify_lead_assignment AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_lead_assignment();

-- ============ SEED: default site content blocks ============
INSERT INTO public.site_content (block_key, title, body, data) VALUES
  ('hero', 'Learn. Achieve. Succeed.', 'India''s most trusted coaching for academic excellence.', '{"badge":"Class 1 → 12"}'::jsonb),
  ('about', 'About Academic Achievers', 'Expert faculty, small batches and a proven track record of toppers.', '{}'::jsonb),
  ('contact', 'Contact Us', 'Reach us for admissions, demos, or any queries.', '{"phone":"+91-00000-00000","email":"contact@academicachievers.in","address":""}'::jsonb)
ON CONFLICT (block_key) DO NOTHING;