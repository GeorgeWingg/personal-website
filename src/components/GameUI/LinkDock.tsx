'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/GeorgeWingg',
    icon: <Github size={24} />,
  },
  {
    id: 'twitter',
    label: 'X',
    href: 'https://x.com/george__wing',
    icon: <Twitter size={24} />,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/george-wing-data/',
    icon: <Linkedin size={24} />,
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:georgewingwig@gmail.com',
    icon: <Mail size={24} />,
  },
];

export default function LinkDock() {
  return (
    <div className="h-16 bg-game-panel border-t border-game-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3 md:gap-6 mx-auto md:mx-0">
        {socialLinks.map((link) => (
          <motion.a
            key={link.id}
            href={link.href}
            target={link.id !== 'email' ? '_blank' : undefined}
            rel={link.id !== 'email' ? 'noopener noreferrer' : undefined}
            className="relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Icon container */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-game-dark border border-game-border transition-all duration-200 group-hover:border-game-green group-hover:shadow-game-glow">
              <span className="text-game-text group-hover:text-game-green transition-colors">
                {link.icon}
              </span>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-game-green/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
            </div>
            
            {/* Tooltip - hidden on mobile */}
            <motion.div
              className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-6 px-2 py-1 bg-game-dark border border-game-border rounded text-xs font-mono text-game-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              {link.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-game-border" />
            </motion.div>
          </motion.a>
        ))}
      </div>
      
      {/* Version info - hidden on mobile */}
      <div className="hidden sm:block absolute right-4 md:right-6">
        <p className="text-xs text-game-text/50 font-mono">v0.2.0</p>
      </div>
    </div>
  );
}