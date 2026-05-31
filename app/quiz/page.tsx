'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, AlertCircle } from 'lucide-react';

import { useQuiz } from '@/hooks/useQuiz';
import { useTimer } from '@/hooks/useTimer';
import QuestionCard from '@/components/quiz/QuestionCard';
import ProgressBar from '@/components/quiz/ProgressBar';
import QuizTimer from '@/components/quiz/QuizTimer';
import { Button } from '@/components/ui/button';

export default function QuizPage() {
  const router = useRouter();
  const quiz = useQuiz();
  const timer = useTimer();

  // Track navigation direction for slide animations
  const prevIndexRef = useRef(quiz.currentIndex);
  const direction = quiz.currentIndex >= prevIndexRef.current ? 'right' : 'left';
  prevIndexRef.current = quiz.currentIndex;

  // Start timer when quiz becomes active
  useEffect(() => {
    if (quiz.status === 'active' && !timer.isRunning) {
      timer.start();
    }
  }, [quiz.status, timer]);

  // Redirect if no questions loaded
  useEffect(() => {
    if (quiz.status === 'idle' || quiz.questions.length === 0) {
      router.replace('/generate');
    }
  }, [quiz.status, quiz.questions.length, router]);

  // Keyboard nav: Left/Right arrows for prev/next
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && quiz.hasAnsweredCurrent()) quiz.nextQuestion();
      if (e.key === 'ArrowLeft') quiz.previousQuestion();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [quiz]);

  const handleFinish = () => {
    timer.pause();
    quiz.finishQuiz(timer.elapsed);
    router.push('/results');
  };

  // Don't render until hydrated with questions
  if (quiz.questions.length === 0 || !quiz.currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading quiz…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pt-8 pb-16" aria-label="Quiz">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/generate')}
            aria-label="Back to generator"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Back
          </Button>

          <QuizTimer elapsed={timer.elapsed} isRunning={timer.isRunning} />
        </div>

        {/* Progress */}
        <ProgressBar
          current={quiz.currentIndex + 1}
          total={quiz.totalQuestions}
          answered={quiz.answeredCount}
        />

        {/* Question card with slide animation */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={quiz.currentQuestion.id}
            question={quiz.currentQuestion}
            questionNumber={quiz.currentIndex + 1}
            totalQuestions={quiz.totalQuestions}
            currentAnswer={quiz.getCurrentAnswer()}
            onAnswer={(i) => quiz.answerQuestion(quiz.currentQuestion!.id, i)}
            direction={direction}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            onClick={quiz.previousQuestion}
            disabled={quiz.isFirstQuestion}
            aria-label="Previous question"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {/* Dot navigation */}
            <div className="hidden sm:flex items-center gap-1" role="list" aria-label="Questions">
              {quiz.questions.map((q, i) => {
                const answered = quiz.userAnswers.find((a) => a.questionId === q.id);
                return (
                  <button
                    key={q.id}
                    role="listitem"
                    onClick={() => quiz.goToQuestion(i)}
                    aria-label={`Go to question ${i + 1}${answered ? ', answered' : ''}`}
                    aria-current={i === quiz.currentIndex ? 'true' : undefined}
                    className={`w-2 h-2 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 outline-none ${
                      i === quiz.currentIndex
                        ? 'bg-violet-400 w-4'
                        : answered
                        ? 'bg-violet-700'
                        : 'bg-white/15 hover:bg-white/30'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {quiz.isLastQuestion ? (
            <Button
              onClick={handleFinish}
              disabled={!quiz.allAnswered}
              aria-label="Finish quiz and see results"
              className="gap-2"
            >
              <Flag className="w-4 h-4" aria-hidden="true" />
              {quiz.allAnswered ? 'Finish Quiz' : `${quiz.answeredCount}/${quiz.totalQuestions} answered`}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={quiz.nextQuestion}
              disabled={!quiz.hasAnsweredCurrent()}
              aria-label="Next question"
            >
              Next
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Skip hint */}
        {!quiz.hasAnsweredCurrent() && !quiz.isLastQuestion && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-zinc-600 flex items-center justify-center gap-1"
            role="note"
          >
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            Answer the question to continue
          </motion.p>
        )}
      </div>
    </main>
  );
}
