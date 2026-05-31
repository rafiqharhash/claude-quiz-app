import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'QuizMind AI — Transform Text into Interactive Quizzes',
  description:
    'AI-powered quiz generator that transforms PDFs or text into interactive multiple-choice quizzes using Claude AI. Study smarter, learn faster.',
  keywords: ['quiz generator', 'AI quiz', 'Claude AI', 'PDF quiz', 'MCQ generator', 'EdTech'],
  authors: [{ name: 'QuizMind AI' }],
  openGraph: {
    title: 'QuizMind AI',
    description: 'Transform any PDF or text into an interactive quiz instantly with AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuizMind AI',
    description: 'Transform any PDF or text into an interactive quiz instantly with AI.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-[#07070f] text-white antialiased min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(240 10% 10%)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
