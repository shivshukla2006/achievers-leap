import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageCircle, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  student_class: z.string().min(1, "Select a class"),
  exam: z.string().min(1, "Select a target"),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20).regex(/^[0-9+\-\s()]+$/, "Invalid phone"),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().max(1000).optional(),
  hp: z.string().max(0, "Bot detected").optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const EXAMS = ["Boards", "JEE", "NEET", "Olympiad", "Foundation"];

export function EnquiryForm() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    if (values.hp) return;
    const { error } = await supabase.from("leads").insert({
      name: values.name,
      student_class: values.student_class,
      exam: values.exam,
      phone: values.phone,
      email: values.email,
      message: values.message ?? null,
    });
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone(true);
    reset();
    toast.success("Enquiry received! Our counsellor will reach out soon.");
    setTimeout(() => setDone(false), 5000);
  };

  return (
    <section id="enquiry" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-primary opacity-10 blur-[120px] -z-10" />
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex glass px-4 py-1.5 rounded-full text-xs font-medium">
            <Sparkles className="h-3 w-3 mr-1.5 text-accent" /> Free counselling
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Talk to a <span className="gradient-text">mentor</span> in 24 hours
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Tell us about your goals. Our academic counsellor will craft a personalised roadmap
            tailored to your class, target exam and current preparation level.
          </p>

          <a
            href="https://wa.me/919999999999?text=Hi%20Academic%20Achievers%2C%20I%27m%20interested%20in%20admissions"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 glass rounded-2xl p-4 hover:scale-[1.02] transition-transform"
          >
            <div className="h-11 w-11 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="font-semibold text-sm">Quick connect on WhatsApp</div>
              <div className="text-xs text-muted-foreground">Average reply under 5 minutes</div>
            </div>
          </a>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Personalised study roadmap</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Free diagnostic test access</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> No obligation, no spam</li>
          </ul>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-7 md:p-8 shadow-glow space-y-4 relative"
        >
          <div className="absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <h3 className="font-display text-2xl font-bold">Book free counselling</h3>

          {/* Honeypot */}
          <input type="text" tabIndex={-1} autoComplete="off" {...register("hp")} className="hidden" />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name" error={errors.name?.message}>
              <input {...register("name")} className={inputCls} placeholder="Aarav Singh" />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input {...register("phone")} className={inputCls} placeholder="+91 98xxxxxx21" />
            </Field>
          </div>

          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} type="email" className={inputCls} placeholder="parent@example.com" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Class" error={errors.student_class?.message}>
              <select {...register("student_class")} className={inputCls} defaultValue="">
                <option value="" disabled>Select class</option>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Target" error={errors.exam?.message}>
              <select {...register("exam")} className={inputCls} defaultValue="">
                <option value="" disabled>Select target</option>
                {EXAMS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Message (optional)">
            <textarea {...register("message")} rows={3} className={`${inputCls} resize-none`} placeholder="Anything we should know?" />
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {done ? (<><CheckCircle2 className="h-4 w-4" /> Sent!</>) : isSubmitting ? "Sending..." : (<>Submit enquiry <Send className="h-4 w-4" /></>)}
          </button>
          <p className="text-[11px] text-center text-muted-foreground">Protected against spam · We respect your privacy.</p>
        </motion.form>
      </div>
    </section>
  );
}

const inputCls = "w-full h-11 rounded-xl bg-background/60 border border-border px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
