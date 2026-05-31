import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] mt-24" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold gradient-text">QuizMind AI</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Transform any PDF or text into interactive quizzes instantly using the power of AI.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Product</h3>
            <ul className="space-y-2" role="list">
              {[
                { href: '/generate', label: 'Generate Quiz' },
                { href: '/#features', label: 'Features' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Built With</h3>
            <ul className="space-y-2 text-sm text-zinc-500" role="list">
              <li>Next.js 15 + TypeScript</li>
              <li>Tailwind CSS + Framer Motion</li>
              <li>Gemini AI by Google</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {year} QuizMind AI. Built with ❤️ and Gemini AI.
          </p>
          <p className="text-xs text-zinc-600">
            Powered by Google Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
