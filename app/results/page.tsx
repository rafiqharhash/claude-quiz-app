'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RefreshCw, Plus, Home } from 'lucide-react';

import { useQuizStore } from '@/store/quizStore';
import ScoreCard from '@/components/results/ScoreCard';
import QuestionReview from '@/components/results/QuestionReview';
import ExportButton from '@/components/results/ExportButton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function ResultsPage() {
  const router = useRouter();
  const { result, questions, settings, resetQuiz, setStatus } = useQuizStore();

  // Guard: redirect if no result
  useEffect(() => {
    if (!result || questions.length === 0) {
      router.replace('/generate');
    }
  }, [result, questions.length, router]);

  if (!result || questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading results…</div>
      </main>
    );
  }

  const handleRetry = () => {
    // Reset answers but keep same questions
    setStatus('active');
    useQuizStore.setState({ currentIndex: 0, userAnswers: [], result: null });
    router.push('/quiz');
  };

  const handleNewQuiz = () => {
    resetQuiz();
    router.push('/generate');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4" aria-label="Quiz results">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold mb-2">
              Quiz{' '}
              <span className="gradient-text">Complete!</span>
            </h1>
            <p className="text-zinc-400">
              {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)} difficulty
              {' · '}
              {questions.length} questions
            </p>
          </motion.div>

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ScoreCard result={result} />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              id="retry-btn"
              onClick={handleRetry}
              variant="secondary"
              size="lg"
              className="flex-1 gap-2"
              aria-label="Retry the same quiz"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Retry Quiz
            </Button>

            <Button
              id="new-quiz-btn"
              onClick={handleNewQuiz}
              size="lg"
              className="flex-1 gap-2"
              aria-label="Generate a new quiz"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              New Quiz
            </Button>

            <ExportButton questions={questions} result={result} settings={settings} />
          </motion.div>

          {/* Question review */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <QuestionReview questions={questions} answers={result.answers} />
          </motion.div>

          {/* Home link */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="gap-2 text-zinc-500 hover:text-zinc-300"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
