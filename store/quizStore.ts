import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  QuizState,
  QuizQuestion,
  QuizStatus,
  QuizSettings,
  UserAnswer,
  QuizResult,
  QuizHistoryEntry,
} from '@/types/quiz';

const DEFAULT_SETTINGS: QuizSettings = {
  difficulty: 'medium',
  numQuestions: 10,
  sourceType: 'text',
  model: 'gemini-3.5-flash',
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────
      questions: [],
      currentIndex: 0,
      userAnswers: [],
      status: 'idle' as QuizStatus,
      settings: DEFAULT_SETTINGS,
      result: null,
      history: [],

      // ── Actions ──────────────────────────────────────────

      setQuestions: (questions: QuizQuestion[]) =>
        set({ questions, currentIndex: 0, userAnswers: [], result: null }),

      setStatus: (status: QuizStatus) => set({ status }),

      answerQuestion: (questionId: string, selectedAnswer: number) => {
        const { questions, userAnswers } = get();
        const question = questions.find((q) => q.id === questionId);
        if (!question) return;

        const isCorrect = selectedAnswer === question.correctAnswer;
        const newAnswer: UserAnswer = { questionId, selectedAnswer, isCorrect };

        const existingIdx = userAnswers.findIndex((a) => a.questionId === questionId);
        if (existingIdx >= 0) {
          const updated = [...userAnswers];
          updated[existingIdx] = newAnswer;
          set({ userAnswers: updated });
        } else {
          set({ userAnswers: [...userAnswers, newAnswer] });
        }
      },

      nextQuestion: () => {
        const { currentIndex, questions } = get();
        if (currentIndex < questions.length - 1) {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      previousQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 });
        }
      },

      goToQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentIndex: index });
        }
      },

      finishQuiz: (timeTaken: number) => {
        const { questions, userAnswers, settings } = get();
        const correctCount = userAnswers.filter((a) => a.isCorrect).length;
        const wrongCount = questions.length - correctCount;
        const accuracy = Math.round((correctCount / questions.length) * 100);

        const result: QuizResult = {
          score: correctCount,
          totalQuestions: questions.length,
          correctCount,
          wrongCount,
          accuracy,
          timeTaken,
          answers: userAnswers,
        };

        const historyEntry: QuizHistoryEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          questions,
          result,
          settings,
          sourcePreview: '',
        };

        set({
          result,
          status: 'finished',
          history: [historyEntry, ...get().history].slice(0, 10),
        });
      },

      resetQuiz: () =>
        set({
          questions: [],
          currentIndex: 0,
          userAnswers: [],
          result: null,
          status: 'idle',
        }),

      updateSettings: (partial: Partial<QuizSettings>) =>
        set({ settings: { ...get().settings, ...partial } }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'quizmind-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        questions: state.questions,
        currentIndex: state.currentIndex,
        userAnswers: state.userAnswers,
        status: state.status,
        settings: state.settings,
        result: state.result,
        history: state.history,
      }),
    }
  )
);
