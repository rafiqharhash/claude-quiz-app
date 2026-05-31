'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuizQuestion, UserAnswer } from '@/types/quiz';
import QuestionCard from '@/components/quiz/QuestionCard';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

interface QuestionReviewProps {
  questions: QuizQuestion[];
  answers: UserAnswer[];
}

export default function QuestionReview({ questions, answers }: QuestionReviewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getAnswer = (questionId: string): UserAnswer | null =>
    answers.find((a) => a.questionId === questionId) ?? null;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-white mb-4">Question Review</h2>

      {questions.map((question, i) => {
        const answer = getAnswer(question.id);
        const isCorrect = answer?.isCorrect ?? false;
        const isExpanded = expandedId === question.id;

        return (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              'glass rounded-2xl overflow-hidden border transition-colors duration-200',
              isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'
            )}
          >
            {/* Summary row */}
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : question.id)}
              aria-expanded={isExpanded}
              aria-controls={`review-${question.id}`}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
            >
              {/* Number */}
              <span className="text-xs font-bold text-zinc-600 tabular-nums w-5 flex-shrink-0">
                {i + 1}
              </span>

              {/* Correct/wrong icon */}
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-label="Correct" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" aria-label="Wrong" />
              )}

              {/* Question preview */}
              <span className="flex-1 text-sm text-zinc-300 line-clamp-1 font-medium">
                <MarkdownRenderer content={question.question} />
              </span>

              {/* Expand chevron */}
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>

            {/* Expanded review */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  id={`review-${question.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-white/6 pt-4">
                    <QuestionCard
                      question={question}
                      questionNumber={i + 1}
                      totalQuestions={questions.length}
                      currentAnswer={answer}
                      onAnswer={() => {}}
                      reviewMode
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
