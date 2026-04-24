-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  exam TEXT NOT NULL,
  class_range TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active courses" ON public.courses FOR SELECT
  TO anon, authenticated
  USING (active = true OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

CREATE POLICY "Staff insert courses" ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

CREATE POLICY "Staff update courses" ON public.courses FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins delete courses" ON public.courses FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  qualification TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  experience_years INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view visible teachers" ON public.teachers FOR SELECT
  TO anon, authenticated
  USING (visible = true OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

CREATE POLICY "Staff insert teachers" ON public.teachers FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

CREATE POLICY "Staff update teachers" ON public.teachers FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins delete teachers" ON public.teachers FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER courses_set_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER teachers_set_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket for site images (alumni, teachers, courses)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

CREATE POLICY "Public read site-images" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "Staff upload site-images" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'site-images' AND
    (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'))
  );

CREATE POLICY "Staff update site-images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'site-images' AND
    (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'))
  );

CREATE POLICY "Staff delete site-images" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'site-images' AND
    (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'))
  );