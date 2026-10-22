import React, { useState } from 'react';
import { Book } from '../types/book';
import { BookCover } from './BookCover';
import { useLibrary } from '../context/LibraryContext';
import { Heart, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface HeroFeaturedProps {
  book: Book;
  onSelectBook: (bookId: string) => void;
  onStartReading: (bookId: string) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  book: initialBook,
  onSelectBook,
  onStartReading
}) => {
  const { books, isFavorite, toggleFavorite } = useLibrary();

  // Find premier featured books with authentic covers
  const featuredHighlights = [
    books.find((b) => b.id === 'form-void') || initialBook,
    books.find((b) => b.id === 'celestial-mechanics'),
    books.find((b) => b.id === 'the-zen-garden'),
    books.find((b) => b.id === 'meditations-on-time'),
    books.find((b) => b.id === 'thinking-machines'),
    books.find((b) => b.id === 'the-quiet-hour')
  ].filter(Boolean) as Book[];

  const [activeBookId, setActiveBookId] = useState<string>(initialBook.id);
  const currentBook =
    featuredHighlights.find((b) => b.id === activeBookId) || initialBook;

  const favorited = isFavorite(currentBook.id);

  return (
    <section className="relative overflow-hidden border-b border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-b from-stone-100/60 via-stone-50 to-stone-50 dark:from-[#141416] dark:via-[#101012] dark:to-stone-950 py-12 md:py-16 transition-colors">
      {/* Ambient premium glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-300/20 dark:bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-stone-300/30 dark:bg-stone-700/20 blur-3xl" />
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Book Introduction */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed kicker metadata with typographic separators */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-medium">
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Archival Monograph</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentBook.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{currentBook.publishedYear}</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 dark:text-stone-50 leading-[1.15] text-balance">
                {currentBook.title}
              </h1>
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-serif italic max-w-xl">
                {currentBook.subtitle}
              </p>
            </div>

            {/* Author Attribution & Unboxed Details */}
            <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
              <span className="font-medium text-stone-900 dark:text-stone-200">
                By {currentBook.author}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{currentBook.pages} pages</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">~{currentBook.readTimeHours} hrs</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-medium text-amber-700 dark:text-amber-400">
                ★ {currentBook.rating.toFixed(1)}
              </span>
            </div>

            {/* Book quote / premise - clean subtle callout without thick border-l-4 */}
            <div className="p-4 sm:p-5 rounded-lg bg-white/70 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-serif text-sm sm:text-base leading-relaxed shadow-2xs">
              <p className="italic">“{currentBook.quote}”</p>
              {currentBook.quoteAttribution && (
                <span className="block mt-2 text-xs not-italic font-sans text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  — {currentBook.quoteAttribution}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartReading(currentBook.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-sm transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Sample Excerpt</span>
              </button>

              <button
                onClick={() => onSelectBook(currentBook.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300/80 dark:border-stone-700 transition-colors cursor-pointer shadow-2xs"
              >
                <span>Volume Overview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleFavorite(currentBook.id)}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                className={`p-2.5 rounded-md border transition-colors cursor-pointer ${
                  favorited
                    ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'border-stone-300/80 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 bg-white dark:bg-stone-900 shadow-2xs'
                }`}
                title={favorited ? 'In Favorites' : 'Add to Favorites'}
              >
                <Heart
                  className={`w-4 h-4 ${favorited ? 'fill-current text-amber-700 dark:text-amber-400' : ''}`}
                />
              </button>
            </div>

            {/* Quick Spotlight Switcher */}
            <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono whitespace-nowrap">
                Spotlight:
              </span>
              <div className="flex items-center gap-2">
                {featuredHighlights.map((feat) => {
                  const isSelected = feat.id === currentBook.id;
                  return (
                    <button
                      key={feat.id}
                      onClick={() => setActiveBookId(feat.id)}
                      className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium'
                          : 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700'
                      }`}
                    >
                      {feat.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Book Display with realistic depth */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              onClick={() => onSelectBook(currentBook.id)}
              className="relative max-w-xs sm:max-w-sm w-full cursor-pointer group transform transition-transform duration-200 hover:-translate-y-1.5"
            >
              <BookCover
                coverImage={currentBook.coverImage}
                title={currentBook.title}
                author={currentBook.author}
                category={currentBook.category}
                className="w-full shadow-2xl rounded-xs"
              />
              <div className="mt-3 text-center">
                <span className="text-xs text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">
                  Click cover to inspect edition & table of contents →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
