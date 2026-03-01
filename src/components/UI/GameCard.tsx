'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Project } from '@/data/projects';

interface GameCardProps {
  project: Project;
}

const statusStyles: Record<Project['status'], { bg: string; text: string; glow: string }> = {
  Shipped: { 
    bg: 'bg-cyber-blue/10', 
    text: 'text-cyber-blue', 
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)] border border-cyber-blue/40' 
  },
  WIP: { 
    bg: 'bg-cyber-purple/10', 
    text: 'text-cyber-purple', 
    glow: 'shadow-[0_0_15px_rgba(189,0,255,0.3)] border border-cyber-purple/40' 
  },
  Concept: { 
    bg: 'bg-cyber-pink/10', 
    text: 'text-cyber-pink', 
    glow: 'shadow-[0_0_15px_rgba(255,0,85,0.3)] border border-cyber-pink/40' 
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
      <div className="h-full p-6 bg-black/40 backdrop-blur-sm rounded-sm border border-terminal-border/50 hover:border-cyber-blue/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300 group game-focus overflow-hidden relative">
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-orbitron font-bold text-xl text-white group-hover:text-cyber-blue group-hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-all">
              {project.title}
            </h3>
            {project.href && (
              <ExternalLink className="w-5 h-5 text-terminal-text group-hover:text-cyber-blue transition-colors" />
            )}
          </div>
          
          <p className="text-terminal-text group-hover:text-white/80 transition-colors mb-4 flex-1 text-sm leading-relaxed">
            {project.blurb}
          </p>
          
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.glow}`}>
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