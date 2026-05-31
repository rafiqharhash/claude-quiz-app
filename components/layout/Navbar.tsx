'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/generate', label: 'Generate' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50"
    >
      {/* Blur backdrop strip */}
      <div className="h-16 flex items-center px-4 sm:px-6 border-b border-white/[0.06] bg-[#07070f]/80 backdrop-blur-xl">
        <nav
          className="max-w-6xl mx-auto w-full flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="QuizMind AI home">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <Brain className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">QuizMind AI</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 outline-none',
                  pathname === link.href
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'text-zinc-400 hover:text-white hover:bg-white/6'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* CTA button */}
            <Link
              href="/generate"
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-500 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
              aria-label="Start generating a quiz"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:block">Start Quiz</span>
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
