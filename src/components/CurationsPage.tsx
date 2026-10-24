import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { ArrowRight, Compass } from 'lucide-react';

interface CurationsPageProps {
  onSelectBook: (bookId: string) => void;
  onStartReading: (bookId: string) => void;
}

interface CuratedTheme {
  title: string;
  subtitle: string;
  description: string;
  bookIds: string[];
}

const CURATED_LISTS: CuratedTheme[] = [
  {
    title: 'The Architecture of Silence',
    subtitle: 'Space, void, and tectonic restraint',
    description:
      'Monographs and reflections exploring how materials, empty volumes, and light create tranquil shelters away from contemporary noise.',
    bookIds: ['form-void', 'the-zen-garden', 'the-typographic-grid', 'in-praise-of-shadows']
  },
  {
    title: 'Machines, Mind & Epistemology',
    subtitle: 'The boundaries between human and artificial thought',
    description:
      'Rigorous inquiries into machine perception, cosmological physics, and what it means to be a conscious observer in a mathematical universe.',
    bookIds: ['thinking-machines', 'celestial-mechanics', 'cosmic-horizons', 'gdel-escher-bach']
  },
  {
    title: 'The Art of Slow Observation',
    subtitle: 'Still life, coastlines, and meditative attention',
    description:
      'Prose and criticism dedicated to looking without haste—from Morandi’s dusted vases to fog curling over Hebridean headlands.',
    bookIds: ['the-art-of-looking', 'the-quiet-hour', 'ways-of-seeing', 'on-photography']
  },
  {
    title: 'The Stoic Compass & Interior Freedom',
    subtitle: 'Timeless principles for calm endurance and clear reason',
    description:
      'Classical manuals on equanimity, time scarcity, and grounding the soul against unexpected storms and societal distractions.',
    bookIds: ['meditations-on-time', 'letters-from-a-stoic', 'on-the-shortness-of-life', 'solitude-silence']
  },
  {
    title: 'The Pulse of Civilizations',
    subtitle: 'Empires, trade winds, and the history of knowledge',
    description:
      'Sweeping historical treatises examining the material, maritime, and intellectual currents that shaped the modern world.',
    bookIds: ['the-silk-roads', 'sapiens', 'spqr-a-history-of-ancient-rome', 'the-library-a-fragile-history']
  },
  {
    title: 'Cognitive Wonders & Human Nature',
    subtitle: 'Intuition, bias, and the biological self',
    description:
      'From Oliver Sacks to Daniel Kahneman, examining the fragile and marvelous circuitry of memory, attention, and meaning.',
    bookIds: ['thinking-fast-and-slow', 'the-man-who-mistook-his-wife-for-a-hat', 'flow', 'the-neurobiology-of-silence']
  }
];

export const CurationsPage: React.FC<CurationsPageProps> = ({
  onSelectBook,
  onStartReading
}) => {
  const { books } = useLibrary();

  return (
    <div className="py-8 md:py-12 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn space-y-16">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-medium mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Curatorial Pathways · {books.length}+ Preserved Works</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
          Curated Thematic Pathways
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-serif italic mt-1 max-w-2xl">
          Carefully sequenced syllabi designed for slow reading and cross-disciplinary study, assembled from our {books.length}-volume repository.
        </p>
      </div>

      {/* Thematic Sections */}
      <div className="space-y-16">
        {CURATED_LISTS.map((theme, idx) => {
          const themeBooks = theme.bookIds
            .map((id) => books.find((b) => b.id === id))
            .filter(Boolean);

          return (
            <section
              key={idx}
              className="space-y-6 pb-12 border-b border-stone-200/70 dark:border-stone-800/70 last:border-b-0"
            >
              <div className="max-w-2xl space-y-2">
                <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
                  Pathway 0{idx + 1}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
                  {theme.title}
                </h2>
                <p className="text-sm font-serif italic text-stone-600 dark:text-stone-300">
                  {theme.subtitle}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed pt-1">
                  {theme.description}
                </p>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {themeBooks.map((book) => {
                  if (!book) return null;
                  return (
                    <div
                      key={book.id}
                      onClick={() => onSelectBook(book.id)}
                      className="group flex flex-col justify-between p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg cursor-pointer hover:border-stone-400 dark:hover:border-stone-600 transition-colors shadow-2xs"
                    >
                      <div>
                        <div className="max-w-[190px] mx-auto mb-4">
                          <BookCover
                            coverImage={book.coverImage}
                            title={book.title}
                            author={book.author}
                            category={book.category}
                            className="w-full shadow-md rounded-xs group-hover:scale-[1.02] transition-transform duration-200"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-stone-400">
                            <span className="truncate">{book.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
                              ★ {book.rating.toFixed(1)}
                            </span>
                          </div>
                          <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium truncate">
                            {book.author}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 pt-1 font-serif italic">
                            “{book.quote}”
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-stone-400 tabular-nums">
                          {book.pages} p.
                        </span>
                        <div className="flex items-center gap-1 text-xs font-medium text-stone-800 dark:text-stone-200 group-hover:translate-x-0.5 transition-transform">
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
