'use client';

import { motion } from 'framer-motion';
import { useContentNavigation } from '@/hooks/useContentNavigation';

interface AboutPanelProps {
  isActive?: boolean;
}

interface Interest {
  name: string;
  theme: 'tech' | 'creative' | 'niche';
}

const interests: Interest[] = [
  // Core tech/AI interests (Green)
  { name: 'AI Agents', theme: 'tech' },
  { name: 'AGI / ASI', theme: 'tech' },
  { name: 'Interfaces for Long-term Planning', theme: 'tech' },
  { name: 'Intelligence Amplification', theme: 'tech' },
  { name: 'Human-AI Collaboration', theme: 'tech' },
  { name: 'Reinforcement Learning', theme: 'tech' },
  { name: 'DevTools', theme: 'tech' },
  { name: 'Generative Interfaces', theme: 'tech' },
  { name: 'Brain Computer Interfaces', theme: 'tech' },
  
  // Creative/personal interests (Blue)
  { name: 'Live Music', theme: 'creative' },
  { name: 'Underground Rap', theme: 'creative' },
  { name: 'Japanese Fashion', theme: 'creative' },
  { name: 'Retro Game UI', theme: 'creative' },
  { name: 'VR', theme: 'creative' },
  { name: 'Boxing', theme: 'creative' },
  { name: 'Longevity', theme: 'creative' },
  
  // Business/strategic interests (Purple)
  { name: 'Goal Trees', theme: 'niche' },
  { name: 'Product Design', theme: 'niche' },
  { name: 'Secondhand Market Arbitrage (lowballing on Vinted)', theme: 'niche' },
  { name: 'Startup Building', theme: 'niche' },
  { name: 'Personal Leverage', theme: 'niche' },
  { name: 'Structured Planning', theme: 'niche' },
  { name: 'Theory of Constraints', theme: 'niche' },
  { name: 'Market Efficiency', theme: 'niche' },
  { name: 'London Tech Scene', theme: 'niche' }
];

export default function AboutPanel({ isActive = false }: AboutPanelProps) {
  const { containerRef } = useContentNavigation({ isActive });
  return (
    <div ref={containerRef} className="max-w-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-2xl md:text-3xl mb-6 md:mb-8 text-cyber-blue drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"
      >
        ABOUT
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <p className="text-base md:text-lg leading-relaxed text-game-text">
          Hi, I&apos;m George. Currently thinking about and building the best ways to scale intelligence.
        </p>
        
        <p className="text-base md:text-lg leading-relaxed text-game-text">
          Previously worked as a Data Engineer in Finance. Agents are the most interesting thing to me at the moment.
        </p>
        
        <p className="text-base md:text-lg leading-relaxed text-game-text">
          Looking to spend the short time we have pre-superintelligence working on things I find interesting and building leverage.
        </p>
        
        <p className="text-base md:text-lg leading-relaxed text-game-text">
          Currently in London, but also spending time in San Francisco and the Isle of Man.
        </p>
        
        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-terminal-border/50 shadow-inner">
          <h3 className="font-orbitron font-bold text-sm text-cyber-blue mb-6 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
            INTERESTS
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => {
              const getThemeStyles = (theme: string) => {
                switch (theme) {
                  case 'tech':
                    return 'bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue hover:bg-cyber-blue/20 hover:border-cyber-blue/80 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]';
                  case 'creative':
                    return 'bg-cyber-pink/10 border border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink/20 hover:border-cyber-pink/80 hover:shadow-[0_0_15px_rgba(255,0,85,0.4)]';
                  case 'niche':
                    return 'bg-cyber-purple/10 border border-cyber-purple/40 text-cyber-purple hover:bg-cyber-purple/20 hover:border-cyber-purple/80 hover:shadow-[0_0_15px_rgba(189,0,255,0.4)]';
                  default:
                    return 'bg-black/40 border border-terminal-border text-terminal-text hover:bg-white/10 hover:border-white/50';
                }
              };

              return (
                <motion.button
                  key={interest.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.4 + index * 0.03,
                    duration: 0.3 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-sm text-sm transition-all duration-200 game-focus ${getThemeStyles(interest.theme)}`}
                  tabIndex={0}
                  onClick={() => {
                    // Future functionality placeholder
                    console.log(`Clicked: ${interest.name}`);
                  }}
                >
                  {interest.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
