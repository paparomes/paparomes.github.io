import { useEffect } from "react";
import Hero from "../components/Hero";
import Journey from "../components/Journey";
import Projects from "../components/Projects";
import Services from "../components/Services";
import { motion, useAnimation } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Journey />
      <Projects />
      <Services />
    </div>
  );
};

export default Index;