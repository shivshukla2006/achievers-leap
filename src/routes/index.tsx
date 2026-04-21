import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Courses } from "@/components/sections/Courses";
import { Alumni } from "@/components/sections/Alumni";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Academic Achievers — AI Powered Learning for Future Toppers" },
      { name: "description", content: "India's AI-powered coaching for Class 1–12. JEE, NEET, Boards & Olympiads with personalised mentorship and proven topper results." },
      { property: "og:title", content: "Academic Achievers — AI Powered Learning for Future Toppers" },
      { property: "og:description", content: "Personalised mentorship, holographic classrooms, and a track record of toppers in JEE, NEET, Boards & Olympiads." },
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
        <Alumni />
        <EnquiryForm />
      </main>
      <Footer />
    </div>
  );
}
