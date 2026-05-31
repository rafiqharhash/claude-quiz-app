'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

export default function ProgressBar({ current, total, answered }: ProgressBarProps) {
  const progressPercent = total > 0 ? (current / total) * 100 : 0;
  const answeredPercent = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="space-y-2" role="group" aria-label="Quiz progress">
      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          Question{' '}
          <span className="text-white font-semibold tabular-nums">{current}</span>{' '}
          of{' '}
          <span className="tabular-nums">{total}</span>
        </span>
        <span>
          <span className="text-white font-semibold tabular-nums">{answered}</span>{' '}
          answered
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-2 w-full rounded-full bg-white/6 overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        {/* Answered fill (lighter) */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-violet-900/60 transition-all duration-500 ease-out"
          style={{ width: `${answeredPercent}%` }}
          aria-hidden="true"
        />
        {/* Current position fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
