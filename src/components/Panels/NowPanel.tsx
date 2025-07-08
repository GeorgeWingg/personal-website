'use client';

import { motion } from 'framer-motion';
import { Code, BookOpen, Dumbbell, Cpu, ExternalLink } from 'lucide-react';


interface NowItem {
  category: string;
  icon: React.ReactNode;
  items: (string | { text: string; url: string })[];
  isCompute?: boolean;
}

const nowData: NowItem[] = [
  {
    category: 'Building',
    icon: <Code size={20} />,
    items: ['Goals App with AI agents', 'Personal website redesign', 'Working on projects with DSPy, MCP\'s and A2A'],
  },
  {
    category: 'Reading',
    icon: <BookOpen size={20} />,
    items: [
      { text: 'AI 2027', url: 'https://ai-2027.com' },
      { text: 'SITUATIONAL AWARENESS', url: 'https://situational-awareness.ai' },
      { text: 'Machines of Loving Grace', url: 'https://www.darioamodei.com/essay/machines-of-loving-grace' },
    ],
  },
  {
    category: 'Training',
    icon: <Dumbbell size={20} />,
    items: ['60KG Bench Press', '80KG Squat', '120KG Deadlift', 'Currently interested in boxing training', 'Strength has taken a backseat'],
  },
  {
    category: 'Compute',
    icon: <Cpu size={20} />,
    items: ['RTX 3090 (35.6 TFLOPS)', 'M4 Pro MBP (5.72 TFLOPS)', 'Total: 41.32 TFLOPS'],
    isCompute: true,
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
        What I&apos;m focused on at this point in my life.
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
                <li key={typeof item === 'string' ? item : item.text} className="text-game-text flex items-start">
                  <span className="text-game-green mr-2">▸</span>
                  {typeof item === 'string' ? (
                    item
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 hover:text-game-green transition-colors duration-200"
                    >
                      {item.text}
                      <ExternalLink 
                        size={12} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                      />
                    </a>
                  )}
                </li>
              ))}
            </ul>
            
            {/* GPU Richness Scale for Compute section */}
            {section.isCompute && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-game-text">
                  <span>GPU Poor</span>
                  <span>GPU Rich (8× H100)</span>
                </div>
                <div className="relative h-3 bg-game-dark rounded-full border border-game-border overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500/80 to-orange-400/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '8%' }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  />
                  <div className="absolute inset-0 bg-game-gloss opacity-20 rounded-full" />
                </div>
                <div className="text-xs text-orange-400 font-mono space-y-1">
                  <div>8% of H100 cluster (536 TFLOPS)</div>
                  <div className="text-game-text">41.32 / 536 TFLOPS</div>
                </div>
              </div>
            )}
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