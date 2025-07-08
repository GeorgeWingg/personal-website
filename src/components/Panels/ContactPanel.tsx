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
        className="font-orbitron font-bold text-3xl mb-8 text-game-green"
      >
        CONTACT
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="p-6 bg-game-dark rounded-lg border border-game-border">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-game-green" />
            <h3 className="font-orbitron font-bold text-xl text-white">Get In Touch</h3>
          </div>
          <p className="text-game-text">
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
              className="group"
            >
              <div className="p-4 bg-game-panel-gradient rounded-lg border border-game-border hover:border-game-green/50 hover:shadow-game-glow transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-game-dark rounded-lg flex items-center justify-center text-game-green group-hover:bg-game-green group-hover:text-game-black transition-all">
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-orbitron font-bold text-sm text-game-text">
                        {method.label}
                      </p>
                      <p className="text-white group-hover:text-game-green transition-colors">
                        {method.value}
                      </p>
                    </div>
                  </div>
                  <div className="text-game-text group-hover:text-game-green transition-colors">
                    →
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}