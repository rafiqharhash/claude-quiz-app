'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

const MAX_CHARS = 50_000;

export default function TextInputArea({ value, onChange, error }: TextInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = value.length;
  const isNearLimit = charCount > MAX_CHARS * 0.9;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="text-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your study material here... (minimum 100 characters)"
          rows={10}
          maxLength={MAX_CHARS}
          aria-label="Study material text input"
          aria-describedby={error ? 'text-error' : 'char-count'}
          aria-invalid={!!error}
          className="w-full bg-white/3 border border-white/10 hover:border-white/20 focus:border-violet-500/50 focus:bg-white/5 rounded-2xl p-4 text-sm text-white placeholder-zinc-600 resize-none transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 leading-relaxed"
        />

        {/* Character count */}
        <div
          id="char-count"
          className="absolute bottom-3 right-3"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            className={`text-xs font-mono ${
              isOverLimit
                ? 'text-red-400'
                : isNearLimit
                ? 'text-yellow-400'
                : 'text-zinc-600'
            }`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            id="text-error"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
