'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, FileText, Type, Brain, AlertCircle } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploadZone from '@/components/generate/FileUploadZone';
import TextInputArea from '@/components/generate/TextInputArea';
import QuizSettingsPanel from '@/components/generate/QuizSettings';
import GeneratingAnimation from '@/components/generate/GeneratingAnimation';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';
import { validateTextInput } from '@/lib/validators';
import type { QuizQuestion, SourceType } from '@/types/quiz';

type Tab = 'pdf' | 'text';

export default function GeneratePage() {
  const router = useRouter();
  const { settings, updateSettings, setQuestions, setStatus } = useQuizStore();

  const [activeTab, setActiveTab] = useState<Tab>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textError, setTextError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    updateSettings({ sourceType: tab });
    setTextError(null);
  };

  const handleGenerate = async () => {
    // ── Validate input ───────────────────────────────────
    if (activeTab === 'pdf' && !selectedFile) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    if (activeTab === 'text') {
      const validation = validateTextInput(textInput);
      if (!validation.valid) {
        setTextError(validation.error ?? null);
        return;
      }
      setTextError(null);
    }

    setIsGenerating(true);
    setStatus('generating');

    try {
      const formData = new FormData();
      formData.set('sourceType', activeTab);
      formData.set('difficulty', settings.difficulty);
      formData.set('numQuestions', String(settings.numQuestions));
      if (settings.model) formData.set('model', settings.model);

      if (activeTab === 'pdf' && selectedFile) {
        formData.set('file', selectedFile);
      } else {
        formData.set('text', textInput);
      }

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      const data: { questions?: QuizQuestion[]; error?: string } = await response.json();

      if (!response.ok || !data.questions) {
        throw new Error(data.error ?? 'Failed to generate quiz. Please try again.');
      }

      // Store questions in Zustand (persisted to localStorage)
      setQuestions(data.questions);
      setStatus('active');

      toast.success(`${data.questions.length} questions generated!`);
      router.push('/quiz');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      toast.error(message);
      setStatus('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate =
    !isGenerating &&
    ((activeTab === 'pdf' && !!selectedFile) ||
      (activeTab === 'text' && textInput.trim().length >= 100));

  return (
    <>
      <Navbar />
      <GeneratingAnimation isVisible={isGenerating} numQuestions={settings.numQuestions} />

      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300 mb-4">
              <Brain className="w-3.5 h-3.5" aria-hidden="true" />
              Gemini AI Generator
            </div>
            <h1 className="text-4xl font-extrabold mb-3">
              Generate your{' '}
              <span className="gradient-text">quiz</span>
            </h1>
            <p className="text-zinc-400">
              Upload a PDF or paste text below. The AI will craft quiz questions in seconds.
            </p>
          </motion.div>

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-3xl p-6 sm:p-8 space-y-6"
          >
            {/* Source tabs */}
            <div
              role="tablist"
              aria-label="Input source"
              className="grid grid-cols-2 gap-1 p-1 bg-white/4 rounded-2xl"
            >
              {([
                { id: 'pdf', label: 'Upload PDF', icon: FileText },
                { id: 'text', label: 'Paste Text', icon: Type },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  id={`tab-${id}`}
                  role="tab"
                  aria-selected={activeTab === id}
                  aria-controls={`panel-${id}`}
                  onClick={() => handleTabChange(id)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                    activeTab === id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                      : 'text-zinc-400 hover:text-white hover:bg-white/6'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            {/* Source panels */}
            <div>
              {activeTab === 'pdf' ? (
                <div role="tabpanel" id="panel-pdf" aria-labelledby="tab-pdf">
                  <FileUploadZone onFileSelect={setSelectedFile} selectedFile={selectedFile} />
                </div>
              ) : (
                <div role="tabpanel" id="panel-text" aria-labelledby="tab-text">
                  <TextInputArea
                    value={textInput}
                    onChange={setTextInput}
                    error={textError}
                  />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/6" aria-hidden="true" />

            {/* Quiz settings */}
            <QuizSettingsPanel settings={settings} onSettingsChange={updateSettings} />

            {/* Generate button */}
            <Button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={!canGenerate}
              size="lg"
              className="w-full"
              aria-label={`Generate ${settings.numQuestions} ${settings.difficulty} quiz questions`}
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              Generate {settings.numQuestions} Questions
            </Button>

            {/* Hint when disabled */}
            {!canGenerate && !isGenerating && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-zinc-600 flex items-center justify-center gap-1.5"
                role="note"
              >
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {activeTab === 'pdf'
                  ? 'Upload a PDF file to enable generation'
                  : 'Add at least 100 characters of text'}
              </motion.p>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
