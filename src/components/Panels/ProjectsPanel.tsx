'use client';

import { motion } from 'framer-motion';
import { projects } from '@/data/projects';
import GameCard from '@/components/UI/GameCard';

export default function ProjectsPanel() {
  return (
    <div className="max-w-4xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-8 text-game-green"
      >
        PROJECTS
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <GameCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}