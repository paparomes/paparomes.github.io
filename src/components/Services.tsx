import { motion } from "framer-motion";

const services = [
  {
    title: "Operational Strategy",
    description: "Develop scalable customer service frameworks",
  },
  {
    title: "Process Optimization",
    description: "Streamline workflows and reduce operational costs",
  },
  {
    title: "Technology Implementation",
    description: "Deploy and optimize service tools and platforms",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-navy text-center mb-12"
        >
          Consulting Services
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-6 bg-cerulean-surface rounded-lg"
            >
              <h3 className="text-xl font-semibold text-navy mb-3">
                {service.title}
              </h3>
              <p className="text-navy-light">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="bg-navy hover:bg-navy-light text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
            Get in Touch
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;