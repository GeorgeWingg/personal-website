'use client';

import { motion } from 'framer-motion';

export default function AboutPanel() {
  return (
    <div className="max-w-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-8 text-game-green"
      >
        ABOUT
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <p className="text-lg leading-relaxed text-game-text">
          Hey, I&apos;m George – a builder obsessed with leverage, AI-native systems and
          thoughtful product design. I&apos;ve spent the last few years shipping tools
          that help people move faster by collaborating with machines.
        </p>
        
        <p className="text-lg leading-relaxed text-game-text">
          Currently in London, working on AI agents and thinking about the future.
          When I&apos;m not coding, you&apos;ll find me exploring new music or scribbling 
          product ideas in a notebook.
        </p>
        
        <div className="mt-8 p-4 bg-game-dark rounded-lg border border-game-border">
          <h3 className="font-orbitron font-bold text-sm text-game-green mb-3">INTERESTS</h3>
          <div className="flex flex-wrap gap-2">
            {['AI Agents', 'Quant Trading', 'Product Design', 'Music', 'Boxing'].map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-game-panel border border-game-border rounded-full text-sm text-game-text"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}