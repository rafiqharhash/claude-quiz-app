import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />

        {/* CTA section */}
        <section className="relative px-4 py-24 text-center" aria-label="Call to action">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-800/10 blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Ready to study{' '}
              <span className="gradient-text">smarter?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Upload your first PDF or paste any text and get a quiz in seconds.
            </p>
            <Link
              href="/generate"
              id="bottom-cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              Get Started Free
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
