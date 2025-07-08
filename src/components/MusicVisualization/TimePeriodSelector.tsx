'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { LastfmPeriod } from '@/types/lastfm';

interface TimePeriodSelectorProps {
  selectedPeriod: LastfmPeriod;
  onPeriodChange: (period: LastfmPeriod) => void;
}

const periods: { value: LastfmPeriod; label: string; description: string }[] = [
  { value: '7day', label: 'Week', description: 'Last 7 days' },
  { value: '1month', label: 'Month', description: 'Last 30 days' },
  { value: '3month', label: '3 Months', description: 'Last quarter' },
  { value: '6month', label: '6 Months', description: 'Last half year' },
  { value: '12month', label: 'Year', description: 'Last 12 months' },
  { value: 'overall', label: 'All Time', description: 'Since the beginning' },
];

export default function TimePeriodSelector({ selectedPeriod, onPeriodChange }: TimePeriodSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-game-dark/50 backdrop-blur-sm rounded-lg border border-game-border p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-game-green" />
          <div>
            <h4 className="font-orbitron text-sm font-bold text-white">Time Period</h4>
            <p className="text-xs text-game-text">
              {periods.find(p => p.value === selectedPeriod)?.description}
            </p>
          </div>
        </div>
        
        <div className="flex gap-1">
          {periods.map((period) => (
            <motion.button
              key={period.value}
              onClick={() => onPeriodChange(period.value)}
              className={`relative px-4 py-2 text-xs font-mono rounded-lg transition-all ${
                selectedPeriod === period.value
                  ? 'text-black font-bold'
                  : 'text-game-text hover:text-white hover:bg-game-border'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedPeriod === period.value && (
                <motion.div
                  layoutId="period-selector"
                  className="absolute inset-0 bg-game-green rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{period.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}