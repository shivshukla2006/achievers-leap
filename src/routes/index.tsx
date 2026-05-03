import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Courses } from "@/components/sections/Courses";
import { Faculty } from "@/components/sections/Faculty";
import { Alumni } from "@/components/sections/Alumni";
import { Gallery } from "@/components/sections/Gallery";
import { FAQs } from "@/components/sections/FAQs";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Academic Achievers — Coaching Institute for Class 1 to 12" },
      { name: "description", content: "Trusted coaching institute for Class 1–12. Expert faculty, small batches and proven topper results in JEE, NEET, Boards & Olympiads." },
      { property: "og:title", content: "Academic Achievers — Coaching Institute for Class 1 to 12" },
      { property: "og:description", content: "Experienced faculty, small batches, regular tests and a proven track record of toppers in JEE, NEET, Boards & Olympiads." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Courses />
        <Faculty />
        <Alumni />
        <EnquiryForm />
      </main>
      <Footer />
    </div>
  );
}
