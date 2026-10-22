import React from 'react';
import { Route } from '../hooks/useRouter';
import { BookCategory } from '../types/book';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import {
  Compass,
  BookOpen,
  Sparkles,
  ArrowRight,
  Shuffle,
  Layers,
  Award,
  Clock
} from 'lucide-react';
import heroImg from '../assets/images/book_cover_celestial_mechanics_1792610457608.jpg';

interface ExplorePageProps {
  onNavigate: (route: Route) => void;
  onSelectBook: (bookId: string) => void;
  onStartReading: (bookId: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onNavigate,
  onSelectBook,
  onStartReading
}) => {
  const { books, setSelectedCategory } = useLibrary();

  const handleCategoryClick = (category: BookCategory) => {
    setSelectedCategory(category);
    onNavigate({ name: 'catalog' });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleRandomBook = () => {
    if (books.length === 0) return;
    const randomIndex = Math.floor(Math.random() * books.length);
    const randomBook = books[randomIndex];
    onSelectBook(randomBook.id);
  };

  // 8 noteworthy books from different categories
  const noteworthyBooks = [
    books.find((b) => b.id === 'form-void'),
    books.find((b) => b.id === 'thinking-machines'),
    books.find((b) => b.id === 'celestial-mechanics'),
    books.find((b) => b.id === 'the-zen-garden'),
    books.find((b) => b.id === 'meditations-on-time'),
    books.find((b) => b.id === 'the-quiet-hour'),
    books.find((b) => b.id === 'in-praise-of-shadows'),
    books.find((b) => b.id === 'letters-from-a-stoic')
  ].filter(Boolean);

  const disciplines: { name: Exclude<BookCategory, 'All'>; desc: string }[] = [
    { name: 'Architecture & Design', desc: 'Spatial rhythm, void, and tectonic minimalism.' },
    { name: 'Philosophy', desc: 'Classical reason, metaphysics, ethics, and clarity.' },
    { name: 'Science & Technology', desc: 'Astrophysics, computing, mathematics, and cognition.' },
    { name: 'Literary Fiction', desc: 'Atmospheric prose, interior lives, and human mystery.' },
    { name: 'Essays & Art', desc: 'Aesthetic criticism, typography, and visual culture.' },
    { name: 'History & Civilization', desc: 'Trade winds, ancient empires, and intellectual heritage.' },
    { name: 'Psychology & Mind', desc: 'Consciousness, attention, memory, and cognitive habits.' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Editorial Hero with Atmospheric Background */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(28,25,23,0.76), rgba(28,25,23,0.88)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>Archive Exploration · 200 Preserved Works</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-50 leading-tight">
            The Athenaeum Reading Room
          </h1>

          <p className="text-base sm:text-lg text-stone-200 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Wander through curated monographs, historical treatises, and timeless essays sequenced for sustained, contemplative study.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate({ name: 'catalog' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-stone-900 bg-stone-100 hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Full Catalog</span>
            </button>

            <button
              onClick={handleRandomBook}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-stone-100 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-600/70 transition-colors cursor-pointer shadow-sm"
              title="Pick an unexpected volume for contemplation"
            >
              <Shuffle className="w-4 h-4 text-amber-300" />
              <span>Surprise Me / Random Volume</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Exploration Content */}
      <div className="py-12 md:py-16 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Curated Pathways Spotlight */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800/80 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-medium mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Disciplines</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
                Pivotal Collections
              </h2>
            </div>
            <button
              onClick={() => onNavigate({ name: 'catalog' })}
              className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View all 200 volumes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: 'Architecture & Design' as const,
                title: 'Architecture & Spatial Rhythm',
                desc: 'Monographs on tectonic restraint, void, acoustics, and the emotional resonance of empty volumes.',
                count: `${books.filter((b) => b.category === 'Architecture & Design').length} volumes`,
                icon: Layers
              },
              {
                category: 'Philosophy' as const,
                title: 'Philosophy & The Examined Life',
                desc: 'Stoic resilience, epistemological inquiries, and moral clarity across antiquity and modern times.',
                count: `${books.filter((b) => b.category === 'Philosophy').length} volumes`,
                icon: Award
              },
              {
                category: 'Science & Technology' as const,
                title: 'Cosmic Horizons & Machine Mind',
                desc: 'Cosmological physics, artificial intelligence theory, and the philosophy of mathematics.',
                count: `${books.filter((b) => b.category === 'Science & Technology').length} volumes`,
                icon: Clock
              }
            ].map((item) => (
              <div
                key={item.title}
                onClick={() => handleCategoryClick(item.category)}
                className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 shadow-2xs hover:shadow-md hover:border-amber-400/60 dark:hover:border-amber-700/60 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-amber-700 dark:text-amber-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mb-1.5 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-400 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span>{item.count}</span>
                  <span className="flex items-center gap-1 font-sans text-stone-800 dark:text-stone-200 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Enter</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Browse All 7 Disciplines */}
        <section className="space-y-6">
          <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-3">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
              Browse by Academic Discipline
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic mt-0.5">
              Select any discipline to filter the catalog and inspect its preserved manuscripts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {disciplines.map((cat) => {
              const count = books.filter((b) => b.category === cat.name).length;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="p-4 rounded-lg border border-stone-200/90 dark:border-stone-800/90 bg-white dark:bg-stone-900 text-left hover:border-amber-400/80 dark:hover:border-amber-600/80 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] font-mono tabular-nums text-stone-400 shrink-0">
                      {count} vol.
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    {cat.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* New & Noteworthy Works with Real Book Covers */}
        <section className="space-y-6">
          <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
                Pinnacle Monograph Editions
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic mt-0.5">
                Authentic clothbound and photographic folios in high preservation fidelity.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ name: 'curations' })}
              className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <span>Explore Curated Pathways</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {noteworthyBooks.map((book) => {
              if (!book) return null;
              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book.id)}
                  className="group flex flex-col justify-between p-3.5 sm:p-4 rounded-lg border border-stone-200/90 dark:border-stone-800/90 bg-white dark:bg-stone-900 shadow-2xs hover:shadow-md hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer"
                >
                  <div>
                    <div className="w-full mb-3 rounded-xs overflow-hidden">
                      <BookCover
                        coverImage={book.coverImage}
                        title={book.title}
                        author={book.author}
                        category={book.category}
                        className="w-full shadow-sm group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span className="truncate max-w-[120px]">{book.category}</span>
                        <span className="font-mono text-amber-700 dark:text-amber-400 font-medium">
                          ★ {book.rating.toFixed(1)}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-mono text-[11px]">
                      {book.publishedYear}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartReading(book.id);
                      }}
                      className="text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Read</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Invitation Callout */}
        <section className="rounded-2xl bg-stone-900 dark:bg-stone-800 text-stone-100 p-8 md:p-12 text-center space-y-4 shadow-xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
            Ready to Begin Your Study?
          </h2>
          <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
            Step into the catalog, adjust your reading ambient mode, and explore monographs unhurried by modern distractions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate({ name: 'catalog' })}
              className="px-5 py-2.5 rounded-md bg-stone-100 text-stone-900 font-medium text-sm hover:bg-white transition-colors cursor-pointer"
            >
              Open Complete Catalog
            </button>
            <button
              onClick={() => onNavigate({ name: 'curations' })}
              className="px-5 py-2.5 rounded-md bg-stone-800 text-stone-200 hover:text-white border border-stone-700 font-medium text-sm hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Thematic Syllabi
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};