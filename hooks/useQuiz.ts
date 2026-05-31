'use client';

import { useCallback } from 'react';
import { useQuizStore } from '@/store/quizStore';
import type { UserAnswer } from '@/types/quiz';

/**
 * Thin convenience hook over the Zustand store.
 * Computes derived values so components don't have to.
 */
export function useQuiz() {
  const store = useQuizStore();

  const currentQuestion = store.questions[store.currentIndex] ?? null;
  const totalQuestions = store.questions.length;
  const isFirstQuestion = store.currentIndex === 0;
  const isLastQuestion = store.currentIndex === totalQuestions - 1;
  const progress = totalQuestions > 0 ? ((store.currentIndex + 1) / totalQuestions) * 100 : 0;

  /** Returns the user's answer for the current question, or null */
  const getCurrentAnswer = useCallback((): UserAnswer | null => {
    if (!currentQuestion) return null;
    return store.userAnswers.find((a) => a.questionId === currentQuestion.id) ?? null;
  }, [currentQuestion, store.userAnswers]);

  /** True if the current question has been answered */
  const hasAnsweredCurrent = useCallback((): boolean => {
    const answer = getCurrentAnswer();
    return answer !== null && answer.selectedAnswer >= 0;
  }, [getCurrentAnswer]);

  /** Total number of answered questions (for progress display) */
  const answeredCount = store.userAnswers.filter((a) => a.selectedAnswer >= 0).length;

  /** True if every question has been answered */
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  return {
    ...store,
    currentQuestion,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    progress,
    getCurrentAnswer,
    hasAnsweredCurrent,
    answeredCount,
    allAnswered,
  };
}
