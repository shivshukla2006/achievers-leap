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
import signupBg from "@/assets/signup-bg.jpg";

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
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${signupBg})` }}>
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm pointer-events-none" />
          <div className="relative z-10">
            <Courses />
            <Faculty />
            <Alumni />
            <Gallery />
            <FAQs />
            <EnquiryForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
