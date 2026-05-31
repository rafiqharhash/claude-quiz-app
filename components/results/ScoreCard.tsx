'use client';


import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel, formatTime } from '@/lib/utils';
import type { QuizResult } from '@/types/quiz';

interface ScoreCardProps {
  result: QuizResult;
}

const CIRCLE_RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ≈ 439.8

export default function ScoreCard({ result }: ScoreCardProps) {
  const { accuracy, correctCount, wrongCount, totalQuestions, timeTaken } = result;
  const scoreColor = getScoreColor(accuracy);
  const scoreLabel = getScoreLabel(accuracy);

  // Animated stroke-dashoffset: full circle = 0, empty = CIRCUMFERENCE
  const targetOffset = CIRCUMFERENCE - (accuracy / 100) * CIRCUMFERENCE;

  // Choose ring colour based on score
  const ringGradientId = 'score-gradient';
  const ringColor =
    accuracy >= 80 ? ['#10b981', '#34d399'] : accuracy >= 60 ? ['#f59e0b', '#fbbf24'] : ['#ef4444', '#f87171'];

  return (
    <div className="glass rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-6 glow-violet">
      {/* Score label */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-bold text-white"
        aria-live="polite"
      >
        {scoreLabel}
      </motion.p>

      {/* SVG ring */}
      <div
        className="relative"
        role="img"
        aria-label={`Score: ${accuracy}% accuracy, ${correctCount} correct out of ${totalQuestions}`}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <defs>
            <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ringColor[0]} />
              <stop offset="100%" stopColor={ringColor[1]} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx="90"
            cy="90"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />

          {/* Animated score arc */}
          <motion.circle
            cx="90"
            cy="90"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke={`url(#${ringGradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            transform="rotate(-90 90 90)"
          />
        </svg>

        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className={`text-4xl font-extrabold tabular-nums ${scoreColor}`}
          >
            {accuracy}%
          </motion.span>
          <span className="text-xs text-zinc-500 mt-0.5">accuracy</span>
        </div>
      </div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-4 w-full"
      >
        {[
          { label: 'Correct', value: correctCount, color: 'text-emerald-400' },
          { label: 'Wrong', value: wrongCount, color: 'text-red-400' },
          { label: 'Time', value: formatTime(timeTaken), color: 'text-cyan-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/4 border border-white/6"
          >
            <span className={`text-xl font-bold tabular-nums ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-zinc-500">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
