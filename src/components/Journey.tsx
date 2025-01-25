import { motion } from "framer-motion";

const journeyData = [
  {
    year: "2023",
    company: "Netflix",
    role: "Senior Operations Manager",
    achievement: "Led global CS transformation initiatives",
  },
  {
    year: "2021",
    company: "GetYourGuide",
    role: "Head of Customer Service",
    achievement: "Scaled operations across multiple regions",
  },
  {
    year: "2019",
    company: "Delivery Hero",
    role: "Operations Director",
    achievement: "Implemented innovative service solutions",
  },
];

const Journey = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-navy text-center mb-12"
        >
          Professional Journey
        </motion.h2>

        <div className="space-y-8">
          {journeyData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 bg-cerulean-surface rounded-lg"
            >
              <div className="w-full md:w-24 font-bold text-cerulean">
                {item.year}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-navy">{item.company}</h3>
                <p className="text-navy-light mb-2">{item.role}</p>
                <p className="text-sm text-navy-light">{item.achievement}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;