import { motion } from "framer-motion";

const companies = [
  { 
    name: "GetYourGuide",
    logo: "/lovable-uploads/389aa26e-2c71-40b4-843a-5e09e8b9e4f8.png",
    className: "w-40 h-auto mx-auto opacity-75"
  },
  { 
    name: "Delivery Hero",
    logo: "/lovable-uploads/5bbc4795-161b-4c81-9ca8-96f01b85db48.png",
    className: "w-40 h-auto mx-auto opacity-75"
  },
  { 
    name: "Netflix",
    logo: "/lovable-uploads/a1a07bf3-bd51-4797-92f8-aa1eed8d791b.png",
    className: "w-40 h-auto mx-auto opacity-75"
  },
];

const Companies = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl text-navy text-center mb-12"
        >
          Companies I've worked for
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center"
            >
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className={company.className}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;