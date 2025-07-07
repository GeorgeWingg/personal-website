'use client';

import { motion } from 'framer-motion';
import { Code, BookOpen, Dumbbell, Headphones } from 'lucide-react';

interface NowItem {
  category: string;
  icon: React.ReactNode;
  items: string[];
}

const nowData: NowItem[] = [
  {
    category: 'Building',
    icon: <Code size={20} />,
    items: ['Goals App with AI agents', 'Personal website redesign', 'Experimenting with React Three Fiber'],
  },
  {
    category: 'Reading',
    icon: <BookOpen size={20} />,
    items: ['Dwarkesh Patel essays', 'The Alignment Problem', 'Hacker News daily'],
  },
  {
    category: 'Training',
    icon: <Dumbbell size={20} />,
    items: ['Commonwealth boxing prep', '5x/week gym routine', 'Morning runs'],
  },
  {
    category: 'Listening',
    icon: <Headphones size={20} />,
    items: ['Bladee', 'LCD Soundsystem', 'Aphex Twin'],
  },
];

export default function NowPanel() {
  return (
    <div className="max-w-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-8 text-game-green"
      >
        NOW
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-game-text mb-8"
      >
        What I'm focused on at this point in my life.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {nowData.map((section, index) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 bg-game-dark rounded-lg border border-game-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-game-panel rounded-lg flex items-center justify-center text-game-green">
                {section.icon}
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">
                {section.category}
              </h3>
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="text-game-text flex items-start">
                  <span className="text-game-green mr-2">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 p-4 bg-game-panel/50 rounded-lg border border-game-border"
      >
        <p className="text-sm text-game-text italic">
          Last updated: {new Date().toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>
    </div>
  );
}