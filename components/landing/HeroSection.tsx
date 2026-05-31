'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap, Star, FileText } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Gradient orbs */}
        <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-violet-800/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-100" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#07070f_80%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Powered by Gemini AI
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
        >
          Turn any text into{' '}
          <span className="gradient-text">smart quizzes</span>{' '}
          instantly
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Upload a PDF or paste any text. QuizMind AI instantly generates interactive
          multiple-choice quizzes — perfect for studying, teaching, or testing your knowledge.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/generate"
            id="hero-cta"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 transition-all duration-300 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f] outline-none"
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            Generate a Quiz Free
            <ArrowRight
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-2xl font-semibold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/30 outline-none"
          >
            See Features
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-16 text-sm text-zinc-500"
          aria-label="Key benefits"
        >
          {[
            { icon: Star, label: 'AI-Powered', color: 'text-yellow-400' },
            { icon: Shield, label: 'No Data Stored', color: 'text-emerald-400' },
            { icon: Zap, label: 'Under 30 Seconds', color: 'text-cyan-400' },
            { icon: FileText, label: 'PDF Support', color: 'text-violet-400' },
          ].map(({ icon: Icon, label, color }, i) => (
            <div key={i} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating mock cards for visual flair */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative mt-20 mx-auto max-w-2xl"
          aria-hidden="true"
        >
          {/* Mock question card */}
          <div className="glass rounded-2xl p-6 text-left glow-violet">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs text-zinc-500 font-mono">Question 3 of 10</span>
            </div>
            <p className="font-semibold text-white mb-4">
              What is the primary purpose of the transformer architecture in modern AI models?
            </p>
            <div className="space-y-2">
              {[
                { label: 'A', text: 'To reduce memory usage in training', correct: false },
                { label: 'B', text: 'To enable parallel processing with attention mechanisms', correct: true },
                { label: 'C', text: 'To improve image recognition accuracy', correct: false },
                { label: 'D', text: 'To create smaller neural networks', correct: false },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${
                    opt.correct
                      ? 'bg-violet-500/20 border border-violet-500/40 text-violet-200'
                      : 'bg-white/4 border border-white/8 text-zinc-400'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      opt.correct ? 'bg-violet-500 text-white' : 'bg-white/8 text-zinc-500'
                    }`}
                  >
                    {opt.label}
                  </span>
                  {opt.text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
