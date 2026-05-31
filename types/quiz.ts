// ─────────────────────────────────────────────────────────
// Core type definitions for QuizMind AI
// ─────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';
export type SourceType = 'pdf' | 'text';
export type QuizStatus = 'idle' | 'generating' | 'active' | 'finished';

/** A single multiple-choice quiz question with exactly 4 options */
export interface QuizQuestion {
  id: string;
  question: string;
  /** Always exactly 4 choices; index matches correctAnswer */
  options: [string, string, string, string];
  /** Zero-based index (0–3) of the correct option */
  correctAnswer: number;
  /** Brief AI-generated explanation of the correct answer */
  explanation: string;
}

/** User-configurable settings before generating a quiz */
export interface QuizSettings {
  difficulty: Difficulty;
  numQuestions: number;
  sourceType: SourceType;
  model: string;
}

/** A single user answer recorded during the quiz */
export interface UserAnswer {
  questionId: string;
  /** -1 means skipped / unanswered */
  selectedAnswer: number;
  isCorrect: boolean;
}

/** Computed result after the user finishes the quiz */
export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  /** 0–100 percentage */
  accuracy: number;
  /** Total session time in seconds */
  timeTaken: number;
  answers: UserAnswer[];
}

/** A persisted entry in the quiz history (localStorage) */
export interface QuizHistoryEntry {
  id: string;
  /** ISO date string */
  date: string;
  questions: QuizQuestion[];
  result: QuizResult;
  settings: QuizSettings;
  /** First ~120 chars of the source for preview */
  sourcePreview: string;
}

/** Full Zustand store shape */
export interface QuizState {
  // ── Data ──────────────────────────────────────────────
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: UserAnswer[];
  status: QuizStatus;
  settings: QuizSettings;
  result: QuizResult | null;
  history: QuizHistoryEntry[];

  // ── Actions ───────────────────────────────────────────
  setQuestions: (questions: QuizQuestion[]) => void;
  setStatus: (status: QuizStatus) => void;
  answerQuestion: (questionId: string, selectedAnswer: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  finishQuiz: (timeTaken: number) => void;
  resetQuiz: () => void;
  updateSettings: (partial: Partial<QuizSettings>) => void;
  clearHistory: () => void;
}
