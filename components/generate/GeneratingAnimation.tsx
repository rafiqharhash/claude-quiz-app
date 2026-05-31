'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

const STATUS_MESSAGES = [
  'Reading your content…',
  'Identifying key concepts…',
  'Crafting questions…',
  'Reviewing answers…',
  'Adding explanations…',
  'Finalising your quiz…',
];

interface GeneratingAnimationProps {
  isVisible: boolean;
  numQuestions: number;
}

export default function GeneratingAnimation({ isVisible, numQuestions }: GeneratingAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Cycle through status messages every 2.5 s while visible
  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="generating"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07070f]/90 backdrop-blur-md"
          role="status"
          aria-label="Generating quiz, please wait"
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 glow-violet"
          >
            {/* Animated logo */}
            <div className="relative">
              {/* Outer pulse rings */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-violet-500/30"
              />
              <motion.div
                animate={{ scale: [1, 1.7, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute inset-0 rounded-full bg-violet-500/20"
              />

              {/* Brain icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40"
              >
                <Brain className="w-10 h-10 text-white" aria-hidden="true" />
              </motion.div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-1">Generating Quiz</h2>
              <p className="text-sm text-zinc-500">{numQuestions} questions • AI-powered</p>
            </div>

            {/* Animated status message */}
            <div className="h-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-violet-300 font-medium"
                >
                  {STATUS_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 rounded-full bg-violet-500"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
