'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const skills = {
  "Frontend": [
    "React", "Next.js", "TypeScript", "Tailwind CSS",
    "HTML5", "CSS3", "JavaScript"
  ],
  "Backend": [
    "Node.js", "Express", "Python", "MongoDB",
    "PostgreSQL", "RESTful APIs"
  ],
  "Tools & Others": [
    "Git", "Docker", "AWS", "Firebase",
    "VS Code", "Figma", "Agile"
  ]
};

export function SkillsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="skills" className="py-20 w-full bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Skills & Technologies
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, items], index) => (
              <motion.div
                key={category}
                variants={itemVariants}
                className="bg-secondary/5 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      variants={itemVariants}
                      className="px-3 py-1 bg-background rounded-full text-sm border border-primary/20"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 