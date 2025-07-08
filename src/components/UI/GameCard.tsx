'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Project } from '@/data/projects';

interface GameCardProps {
  project: Project;
}

const statusStyles: Record<Project['status'], { bg: string; text: string; glow: string }> = {
  Shipped: { 
    bg: 'bg-game-green/20', 
    text: 'text-game-green', 
    glow: 'shadow-[0_0_20px_rgba(140,255,140,0.3)]' 
  },
  WIP: { 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-500', 
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
  },
  Concept: { 
    bg: 'bg-game-blue/20', 
    text: 'text-game-blue', 
    glow: 'shadow-[0_0_20px_rgba(0,180,216,0.3)]' 
  },
};

export default function GameCard({ project }: GameCardProps) {
  const statusStyle = statusStyles[project.status];
  
  const CardContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative h-full"
    >
      <div className="h-full p-6 bg-game-panel-gradient rounded-lg border border-game-border shadow-game-panel hover:border-game-green/50 hover:shadow-game-glow transition-all duration-300 group game-focus">
        {/* Gloss overlay */}
        <div className="absolute inset-0 bg-game-gloss rounded-lg pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-orbitron font-bold text-xl text-white group-hover:text-game-green transition-colors">
              {project.title}
            </h3>
            {project.href && (
              <ExternalLink className="w-5 h-5 text-game-text group-hover:text-game-green transition-colors" />
            )}
          </div>
          
          <p className="text-game-text mb-4 flex-1">
            {project.blurb}
          </p>
          
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.glow}`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {CardContent}
      </a>
    );
  }
  
  return CardContent;
}