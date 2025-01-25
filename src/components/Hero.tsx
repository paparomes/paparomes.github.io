import { motion } from "framer-motion";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="min-h-[80vh] flex items-center bg-navy-surface p-4 md:p-8">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-8 leading-tight">
              I turn customer care chaos into your strategic advantage.
            </h1>
            <Button 
              className="bg-cerulean hover:bg-cerulean-dark text-white font-semibold px-8 py-6 text-lg"
            >
              Get in touch
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-200 border-4 border-white shadow-lg">
              {/* Placeholder for headshot */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
