'use client';

import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface QuizTimerProps {
  elapsed: number;
  isRunning: boolean;
}

export default function QuizTimer({ elapsed, isRunning }: QuizTimerProps) {
  const isLong = elapsed >= 3600; // over 1 hour

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8"
      role="timer"
      aria-label={`Time elapsed: ${formatTime(elapsed)}`}
      aria-live="off"
    >
      <Clock
        className={`w-3.5 h-3.5 ${isRunning ? 'text-violet-400' : 'text-zinc-600'}`}
        aria-hidden="true"
      />
      <span
        className={`text-sm font-mono font-semibold tabular-nums ${
          isLong ? 'text-orange-400' : 'text-zinc-300'
        }`}
      >
        {formatTime(elapsed)}
      </span>
    </div>
  );
}
