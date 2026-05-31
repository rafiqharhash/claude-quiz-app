'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuizQuestion, UserAnswer } from '@/types/quiz';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer: UserAnswer | null;
  onAnswer: (selectedIndex: number) => void;
  /** If true, show correct/wrong indicators (results review mode) */
  reviewMode?: boolean;
  direction?: 'left' | 'right';
}

const LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswer,
  reviewMode = false,
  direction = 'right',
}: QuestionCardProps) {
  const hasAnswered = currentAnswer !== null && currentAnswer.selectedAnswer >= 0;

  // ── Keyboard navigation ──────────────────────────────────
  useEffect(() => {
    if (reviewMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-4 map to options 0-3
      const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (keyMap[e.key] !== undefined && !hasAnswered) {
        onAnswer(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, onAnswer, reviewMode]);

  const getOptionState = useCallback(
    (optionIndex: number): 'default' | 'selected' | 'correct' | 'wrong' | 'missed' => {
      if (!hasAnswered && !reviewMode) return 'default';

      const isCorrect = optionIndex === question.correctAnswer;
      const isSelected = currentAnswer?.selectedAnswer === optionIndex;

      if (reviewMode) {
        if (isCorrect) return 'correct';
        if (isSelected && !isCorrect) return 'wrong';
        return 'default';
      }

      // During quiz — only show selected, not the correct answer
      if (isSelected) return 'selected';
      return 'default';
    },
    [hasAnswered, reviewMode, question.correctAnswer, currentAnswer]
  );

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: direction === 'right' ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === 'right' ? -40 : 40 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="glass rounded-2xl p-6 sm:p-8"
    >
      {/* Question header */}
      {!reviewMode && (
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-4">
          Question {questionNumber} of {totalQuestions}
          {!reviewMode && (
            <span className="ml-2 text-zinc-700 normal-case tracking-normal font-normal">
              Press 1–4 to answer
            </span>
          )}
        </p>
      )}

      {/* Question text */}
      <div
        className="text-lg sm:text-xl font-semibold text-white leading-relaxed mb-6"
        id={`question-${question.id}`}
      >
        <MarkdownRenderer content={question.question} />
      </div>

      {/* Answer options */}
      <div
        role="radiogroup"
        aria-labelledby={`question-${question.id}`}
        className="space-y-3"
      >
        {question.options.map((option, i) => {
          const state = getOptionState(i);
          return (
            <AnswerOption
              key={i}
              label={LABELS[i]}
              text={option}
              state={state}
              disabled={hasAnswered && !reviewMode}
              onClick={() => !hasAnswered && !reviewMode && onAnswer(i)}
            />
          );
        })}
      </div>

      {/* Explanation (review mode only) */}
      <AnimatePresence>
        {reviewMode && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-5 p-4 rounded-xl bg-cyan-500/8 border border-cyan-500/15"
          >
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1.5">
              Explanation
            </p>
            <div className="text-sm text-zinc-300 leading-relaxed"><MarkdownRenderer content={question.explanation} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Answer Option ──────────────────────────────────────────

interface AnswerOptionProps {
  label: string;
  text: string;
  state: 'default' | 'selected' | 'correct' | 'wrong' | 'missed';
  disabled: boolean;
  onClick: () => void;
}

function AnswerOption({ label, text, state, disabled, onClick }: AnswerOptionProps) {
  const stateStyles = {
    default: 'border-white/8 bg-white/3 text-zinc-300 hover:border-violet-400/40 hover:bg-violet-500/8 hover:text-white',
    selected: 'border-violet-500/60 bg-violet-500/15 text-white shadow-lg shadow-violet-500/10',
    correct: 'border-emerald-500/60 bg-emerald-500/12 text-emerald-200',
    wrong: 'border-red-500/60 bg-red-500/12 text-red-300',
    missed: 'border-white/5 bg-white/2 text-zinc-600',
  };

  const labelStyles = {
    default: 'bg-white/8 text-zinc-400',
    selected: 'bg-violet-500 text-white',
    correct: 'bg-emerald-500 text-white',
    wrong: 'bg-red-500 text-white',
    missed: 'bg-white/5 text-zinc-600',
  };

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={state === 'selected' || state === 'correct'}
      aria-label={`Option ${label}: ${text}`}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      className={cn(
        'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f] outline-none',
        stateStyles[state],
        disabled && state === 'default' && 'cursor-default opacity-50'
      )}
    >
      {/* Label badge */}
      <span
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors',
          labelStyles[state]
        )}
        aria-hidden="true"
      >
        {label}
      </span>

      {/* Option text */}
      <span className="flex-1"><MarkdownRenderer content={text} /></span>

      {/* State icon */}
      {state === 'correct' && (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
      )}
      {state === 'wrong' && (
        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" aria-hidden="true" />
      )}
    </motion.button>
  );
}
    
