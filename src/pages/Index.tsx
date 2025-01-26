import Hero from "@/components/Hero";
import Companies from "@/components/Companies";
import Projects from "@/components/Projects";
import ContactForm from "@/components/ContactForm";

export default function Index() {
  return (
    <main className="min-h-screen font-inter">
      <Hero />
      <Companies />
      <Projects />
      <ContactForm />
    </main>
  );
}