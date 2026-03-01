'use client';

import { motion } from 'framer-motion';

interface GameFrameProps {
  children: React.ReactNode;
}

export default function GameFrame({ children }: GameFrameProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 md:p-8 font-mono overflow-hidden relative">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.03),transparent_70%)]" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 animated-grid opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative w-full max-w-7xl h-[100vh] md:h-[90vh] max-h-[900px] flex flex-col border border-terminal-border/50 bg-black/80 backdrop-blur-sm shadow-neon-blue z-10 overflow-hidden rounded-sm"
      >
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none scanlines opacity-20 z-50" />

        {/* System Header */}
        <div className="h-10 bg-black/90 border-b border-terminal-border/50 flex items-center px-4 justify-between flex-shrink-0 text-xs tracking-widest uppercase text-terminal-text select-none z-20">
          <div className="flex items-center gap-4">
            <span className="text-cyber-blue font-bold drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">GW.SYS.V3</span>
            <span className="hidden md:inline text-terminal-border">|</span>
            <span className="hidden md:inline text-white/80">ROOT_ACCESS: <span className="text-green-400">GRANTED</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyber-blue animate-blink shadow-[0_0_8px_#00f0ff]" />
              <span className="text-cyber-blue">ONLINE</span>
            </div>
            <span className="hidden md:inline text-terminal-border">|</span>
            <span className="hidden md:inline">MEM: 128TB</span>
          </div>
        </div>
        
        {/* Main viewport */}
        <div className="flex-1 relative overflow-hidden">
           {/* Inner Grid */}
           <div className="absolute inset-0 pointer-events-none bg-terminal-grid-pattern opacity-[0.05]" />
           
           {/* Content */}
           <div className="relative h-full z-10 flex flex-col">
              {children}
           </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="h-8 border-t border-terminal-border/50 bg-black/90 flex items-center px-4 justify-between text-[10px] text-terminal-text uppercase tracking-wider z-20">
           <span className="flex items-center gap-2">
              <span className="text-cyber-purple">➜</span>
              /USR/JUNO/WORKSPACE
           </span>
           <span className="flex items-center gap-2">
              READY
              <div className="w-2 h-4 bg-cyber-blue/20 animate-pulse" />
           </span>
        </div>
      </motion.div>
    </div>
  );
}
