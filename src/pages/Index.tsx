import Hero from "@/components/Hero";
import Companies from "@/components/Companies";
import Projects from "@/components/Projects";

export default function Index() {
  return (
    <main className="min-h-screen font-inter">
      <Hero />
      <Companies />
      <Projects />
    </main>
  );
}