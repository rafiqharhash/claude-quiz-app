'use client';

import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { QuizQuestion, QuizResult, QuizSettings } from '@/types/quiz';

interface ExportButtonProps {
  questions: QuizQuestion[];
  result: QuizResult;
  settings: QuizSettings;
}

export default function ExportButton({ questions, result, settings }: ExportButtonProps) {
  const handleExport = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        settings,
        summary: {
          score: result.score,
          totalQuestions: result.totalQuestions,
          accuracy: `${result.accuracy}%`,
          timeTaken: `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`,
        },
        questions: questions.map((q, i) => {
          const userAnswer = result.answers.find((a) => a.questionId === q.id);
          return {
            number: i + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.options[q.correctAnswer],
            yourAnswer: userAnswer ? q.options[userAnswer.selectedAnswer] ?? 'Not answered' : 'Not answered',
            isCorrect: userAnswer?.isCorrect ?? false,
            explanation: q.explanation,
          };
        }),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quizmind-results-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Results exported successfully!');
    } catch {
      toast.error('Failed to export results. Please try again.');
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      className="flex items-center gap-2"
      aria-label="Export quiz results as JSON file"
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      Export Results
    </Button>
  );
}
