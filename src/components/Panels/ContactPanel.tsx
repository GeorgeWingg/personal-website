'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Twitter, Linkedin, MessageSquare, Instagram } from 'lucide-react';
import { useContentNavigation } from '@/hooks/useContentNavigation';

interface ContactPanelProps {
  isActive?: boolean;
}

interface ContactMethod {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}

const contactMethods: ContactMethod[] = [
  {
    label: 'Email',
    value: 'georgewingwig@gmail.com',
    href: 'mailto:georgewingwig@gmail.com',
    icon: <Mail size={20} />,
  },
  {
    label: 'GitHub',
    value: '@GeorgeWingg',
    href: 'https://github.com/GeorgeWingg',
    icon: <Github size={20} />,
  },
  {
    label: 'X / Twitter',
    value: '@george__wing',
    href: 'https://x.com/george__wing',
    icon: <Twitter size={20} />,
  },
  {
    label: 'LinkedIn',
    value: 'george-wing-data',
    href: 'https://www.linkedin.com/in/george-wing-data/',
    icon: <Linkedin size={20} />,
  },
  {
    label: 'Instagram',
    value: '@georgewggg',
    href: 'https://www.instagram.com/georgewggg/',
    icon: <Instagram size={20} />,
  },
];

export default function ContactPanel({ isActive = false }: ContactPanelProps) {
  const { containerRef } = useContentNavigation({ isActive });
  
  return (
    <div ref={containerRef} className="max-w-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-8 text-cyber-blue drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"
      >
        CONTACT
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="p-6 bg-black/30 backdrop-blur-sm rounded-sm border border-terminal-border/50 shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-cyber-blue drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
            <h3 className="font-orbitron font-bold text-xl text-white">
              Get In Touch
            </h3>
          </div>
          <p className="text-terminal-text leading-relaxed">
            Open to interesting conversations and collaborations. Not currently looking for 
            traditional employment, but always happy to chat about AI, product ideas, or 
            anything else that sparks curiosity.
          </p>
        </div>
        
        <div className="grid gap-4">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.label}
              href={method.href}
              target={method.label !== 'Email' ? '_blank' : undefined}
              rel={method.label !== 'Email' ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group block relative overflow-hidden rounded-sm"
            >
              <div className="p-4 bg-black/40 backdrop-blur-sm border border-terminal-border/50 hover:border-cyber-blue/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black/60 rounded-sm flex items-center justify-center text-cyber-blue border border-terminal-border/30 group-hover:border-cyber-blue group-hover:shadow-[inset_0_0_10px_rgba(0,240,255,0.2)] transition-all">
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-orbitron font-bold text-sm text-terminal-text group-hover:text-white transition-colors">
                        {method.label}
                      </p>
                      <p className="text-white group-hover:text-cyber-blue group-hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-all">
                        {method.value}
                      </p>
                    </div>
                  </div>
                  <div className="text-terminal-text group-hover:text-cyber-blue group-hover:translate-x-1 transition-all">
                    →
                  </div>
                </div>
              </div>
              
              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}