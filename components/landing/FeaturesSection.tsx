'use client';

import { motion } from 'framer-motion';
import {
  Upload,
  Brain,
  Zap,
  Trophy,
  BookOpen,
  BarChart3,
  RefreshCw,
  Lock,
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'PDF & Text Input',
    description:
      'Upload any PDF document or paste raw text. QuizMind extracts content and prepares it for quiz generation.',
    color: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: Brain,
    title: 'AI Quiz Generation',
    description:
      'Gemini AI crafts well-structured MCQ questions tailored to your chosen difficulty — Easy, Medium, or Hard.',
    color: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-cyan-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description:
      'Get up to 20 quiz questions generated in under 30 seconds with detailed AI explanations for each answer.',
    color: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-500/20',
  },
  {
    icon: Trophy,
    title: 'Score Tracking',
    description:
      'Track your performance with an animated score card. See correct vs wrong answers and your accuracy percentage.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: BookOpen,
    title: 'Answer Explanations',
    description:
      'Every question includes an AI-generated explanation so you learn why the correct answer is right.',
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
  },
  {
    icon: BarChart3,
    title: 'Quiz History',
    description:
      'Your last 10 quizzes are saved locally. Review past sessions and track improvement over time.',
    color: 'from-indigo-500 to-blue-500',
    glow: 'shadow-indigo-500/20',
  },
  {
    icon: RefreshCw,
    title: 'Regenerate Anytime',
    description:
      'Not happy with the questions? Regenerate instantly with a click — same content, fresh questions.',
    color: 'from-fuchsia-500 to-purple-500',
    glow: 'shadow-fuchsia-500/20',
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description:
      'No accounts required. Your content is processed server-side and never stored after the quiz is generated.',
    color: 'from-slate-400 to-zinc-400',
    glow: 'shadow-zinc-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 py-24 sm:py-32" aria-label="Features">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 mb-6">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Packed with{' '}
            <span className="gradient-text">powerful features</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Everything you need to turn passive reading into active learning — no signup required.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="glass rounded-2xl p-6 hover:bg-white/6 transition-colors duration-300 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
