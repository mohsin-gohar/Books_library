import React from 'react';
import { Route } from '../hooks/useRouter';
import { BookOpen, Users, Sparkles, Globe, Heart, Shield, Zap, ArrowRight, Bookmark } from 'lucide-react';
import heroImg from '../assets/images/book_cover_form_void_1792609936178.jpg';

interface AboutPageProps {
  onNavigate?: (route: Route) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero with background image */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(28,25,23,0.74), rgba(28,25,23,0.85)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preservation & Purpose · Athenaeum</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-50 leading-tight">
            A Reading Room Built for Slow, Deep Thought
          </h1>
          <p className="text-base sm:text-lg text-stone-200 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Athenaeum is an independent digital library dedicated to typography, architecture, philosophy, science, and the slow arts of reading.
          </p>
        </div>
      </section>

      <div className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: '600+ Archival Volumes',
              desc: 'Curated volumes across seven disciplines, each with verified chapter excerpts, evaluations, and private study notes.',
              action: () => onNavigate && onNavigate({ name: 'catalog' }),
              actionText: 'Browse Catalog'
            },
            {
              icon: Users,
              title: 'Curated Pathways',
              desc: 'Sequenced thematic curricula spanning architecture, stoicism, cosmology, cognitive science, and world history.',
              action: () => onNavigate && onNavigate({ name: 'curations' }),
              actionText: 'Inspect Pathways'
            },
            {
              icon: Bookmark,
              title: 'Personal Bookshelf',
              desc: 'Track reading progress, save private scholarly reflections, and mark volumes as Currently Reading or Completed.',
              action: () => onNavigate && onNavigate({ name: 'favorites' }),
              actionText: 'Open Bookshelf'
            }
          ].map((item) => (
            <div
              key={item.title}
              onClick={item.action}
              className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 shadow-2xs hover:shadow-md hover:border-amber-400/60 dark:hover:border-amber-700/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </section>

        {/* Mission Statement */}
        <section className="space-y-4 bg-stone-100/50 dark:bg-stone-900/40 p-6 sm:p-8 rounded-xl border border-stone-200/80 dark:border-stone-800/80">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            Our Monastic Philosophy
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
            We believe reading should be unhurried. The modern web encourages skimming, reactivity, and algorithmic urgency. Athenaeum is an intentional quiet corner designed to counter that frenzy. We gather treatises that reward patient reflection—from spatial void in architectural theory to Seneca’s manuals on time scarcity.
          </p>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-sans pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
            Handcrafted with React 19, TypeScript, and Tailwind CSS v4. Every volume features custom folio typography, chapter previews, and private reading journal notes that never leave your browser.
          </p>
        </section>

        {/* Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Heart,
              title: 'Curated with Care',
              desc: 'Every volume is selected for intellectual depth, enduring relevance, and craftsmanship.'
            },
            {
              icon: Shield,
              title: 'Privacy First',
              desc: 'Your reading progress, private annotations, and favorites are stored locally in your browser.'
            },
            {
              icon: Zap,
              title: 'Instant & Responsive',
              desc: 'Blazing fast client-side indexing ensures instantaneous search across all 200 monographs without latency.'
            }
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/70 space-y-3"
            >
              <item.icon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Classical Epigraph Quote */}
        <section className="rounded-2xl bg-stone-900 dark:bg-stone-800 text-stone-100 p-8 md:p-12 text-center space-y-4 shadow-xl">
          <p className="font-serif text-xl sm:text-2xl md:text-3xl italic leading-relaxed max-w-2xl mx-auto">
            “A library is not a luxury, but one of the necessities of life.”
          </p>
          <p className="text-xs uppercase tracking-widest text-amber-300 font-mono">
            — Henry Ward Beecher
          </p>
        </section>

        {/* Interactive CTA */}
        <section className="text-center space-y-4 pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            Enter the Collection
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
            Filter by discipline, examine first editions, and add monographs to your personal reading shelf.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate && onNavigate({ name: 'catalog' })}
              className="px-5 py-2.5 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              Explore Complete Catalog
            </button>
            <button
              onClick={() => onNavigate && onNavigate({ name: 'favorites' })}
              className="px-5 py-2.5 rounded-md bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 font-medium text-sm hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Open My Bookshelf
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
