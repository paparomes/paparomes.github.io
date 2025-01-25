import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-surface to-cerulean-surface p-4 md:p-8">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6">
            Operational Excellence at Scale
          </h1>
          <p className="text-lg md:text-xl text-navy-light max-w-2xl mx-auto">
            Transforming customer service operations through strategic consulting and innovative solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { metric: "800+", label: "FTE Managed" },
            { metric: "40%", label: "Cost Reduction" },
            { metric: "3500+", label: "Agents Trained" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-cerulean mb-2">
                {item.metric}
              </h2>
              <p className="text-navy-light">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <button className="bg-navy hover:bg-navy-light text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;