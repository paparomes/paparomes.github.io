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
            { 
              name: "GetYourGuide",
              logo: "/lovable-uploads/389aa26e-2c71-40b4-843a-5e09e8b9e4f8.png",
              className: "w-48 h-auto mx-auto"
            },
            { 
              name: "Delivery Hero",
              logo: "/lovable-uploads/5bbc4795-161b-4c81-9ca8-96f01b85db48.png",
              className: "w-48 h-auto mx-auto"
            },
            { 
              name: "Netflix",
              logo: "/lovable-uploads/a1a07bf3-bd51-4797-92f8-aa1eed8d791b.png",
              className: "w-48 h-auto mx-auto"
            },
          ].map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center"
            >
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className={company.className}
              />
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