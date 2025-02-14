'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" className="py-20 w-full bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-muted-foreground">
                I am a passionate Full Stack Developer with expertise in building modern web applications.
                My journey in web development started with a curiosity for creating interactive user experiences.
              </p>
              <p className="text-muted-foreground">
                I specialize in React, Next.js, and Node.js, with a strong focus on creating
                performant and scalable applications that solve real-world problems.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-secondary/10 p-6 rounded-lg"
            >
              <h3 className="font-semibold mb-4">Quick Facts</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span>Full Stack Development</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span>UI/UX Design</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span>Responsive Web Design</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span>Performance Optimization</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 