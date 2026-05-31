'use client';

import { cn } from '@/lib/utils';
import type { Difficulty, QuizSettings } from '@/types/quiz';

interface QuizSettingsProps {
  settings: QuizSettings;
  onSettingsChange: (partial: Partial<QuizSettings>) => void;
}

const DIFFICULTIES: { value: Difficulty; label: string; description: string; color: string }[] = [
  {
    value: 'easy',
    label: 'Easy',
    description: 'Factual recall',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Comprehension',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'Critical thinking',
    color: 'from-red-500 to-rose-600',
  },
];

const MODELS: { value: string; label: string; description: string }[] = [
  { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', description: 'Latest & most capable' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Fast & reliable' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite', description: 'Highest free quota' },
];

export default function QuizSettingsPanel({ settings, onSettingsChange }: QuizSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3" id="difficulty-label">
          Difficulty Level
        </label>
        <div
          role="radiogroup"
          aria-labelledby="difficulty-label"
          className="grid grid-cols-3 gap-2"
        >
          {DIFFICULTIES.map((diff) => {
            const isSelected = settings.difficulty === diff.value;
            return (
              <button
                key={diff.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSettingsChange({ difficulty: diff.value })}
                className={cn(
                  'relative p-3 rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
                  isSelected
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/6'
                )}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full bg-gradient-to-br mb-2',
                    diff.color,
                    isSelected ? 'opacity-100' : 'opacity-40'
                  )}
                />
                <p className={cn('text-sm font-semibold', isSelected ? 'text-white' : 'text-zinc-400')}>
                  {diff.label}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">{diff.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3" id="model-label">
          AI Model
        </label>
        <div
          role="radiogroup"
          aria-labelledby="model-label"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          {MODELS.map((model) => {
            const isSelected = settings.model === model.value;
            return (
              <button
                key={model.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSettingsChange({ model: model.value })}
                className={cn(
                  'relative p-3 rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
                  isSelected
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/6'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={cn('text-sm font-semibold', isSelected ? 'text-white' : 'text-zinc-400')}>
                    {model.label}
                  </p>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isSelected ? 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]' : 'bg-transparent border border-zinc-600'
                    )}
                  />
                </div>
                <p className="text-xs text-zinc-600">{model.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Number of questions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="num-questions" className="text-sm font-medium text-zinc-300">
            Number of Questions
          </label>
          <span
            className="text-sm font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-lg tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {settings.numQuestions}
          </span>
        </div>
        <input
          id="num-questions"
          type="range"
          min={5}
          max={20}
          step={1}
          value={settings.numQuestions}
          onChange={(e) => onSettingsChange({ numQuestions: parseInt(e.target.value, 10) })}
          aria-valuemin={5}
          aria-valuemax={20}
          aria-valuenow={settings.numQuestions}
          className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f]"
          style={{
            background: `linear-gradient(to right, #7c3aed ${((settings.numQuestions - 5) / 15) * 100}%, rgba(255,255,255,0.1) ${((settings.numQuestions - 5) / 15) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1.5">
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>
      </div>
    </div>
  );
}
