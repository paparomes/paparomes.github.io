import { motion } from "framer-motion";

const projects = [
  {
    title: "JourneyViz",
    description: "Build, visualize, and optimize your customer journeys without enterprise complexity.",
    status: "Beta",
  },
  {
    title: "Anaro Lens",
    description: "QA software for Customer Service teams",
    status: "Alpha",
  },
];

const Projects = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-navy text-center mb-12"
        >
          Lab Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-navy">{project.title}</h3>
                <span className="px-3 py-1 bg-cerulean-surface text-cerulean text-sm rounded-full">
                  {project.status}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <button className="text-cerulean hover:text-cerulean-dark font-semibold transition-colors duration-300">
                Learn More →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;