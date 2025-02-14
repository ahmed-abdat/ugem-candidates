'use client';

import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

function GeometricShape() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh>
        <torusGeometry args={[2, 0.8, 16, 50]} />
        <meshNormalMaterial wireframe opacity={0.2} transparent />
      </mesh>
    </Float>
  );
}

export function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* 3D Background */}
      <div className="absolute inset-0 w-full h-full opacity-50">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <GeometricShape />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 container mx-auto px-4 py-20 text-center"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="text-primary font-mono">Hi, my name is</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
        >
          Ahmed Abdellahi Abdat
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-6 text-muted-foreground"
        >
          Full Stack Developer
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8"
        >
          Passionate web developer pursuing a Master's in Electronics, specializing in building exceptional digital experiences. Currently focused on building accessible, human-centered products.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-6 mb-12"
        >
          <motion.a
            href="https://github.com/ahmed-abdat"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FiGithub size={24} />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/ahmed-abdellahi-abdat"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FiLinkedin size={24} />
          </motion.a>
          <motion.a
            href="mailto:ahmedeabdat@gmail.com"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FiMail size={24} />
          </motion.a>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View Projects
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            Contact Me
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex justify-center p-2">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
} 