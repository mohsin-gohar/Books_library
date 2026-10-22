import React from 'react';
import { Route } from '../hooks/useRouter';
import { BookCategory } from '../types/book';
import { useLibrary } from '../context/LibraryContext';

interface FooterProps {
  onNavigate: (route: Route) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { setSelectedCategory } = useLibrary();

  const handleCategoryClick = (cat: BookCategory) => {
    setSelectedCategory(cat);
    onNavigate({ name: 'catalog' });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-100/40 dark:bg-stone-950 mt-20 pt-16 pb-12 transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-200/60 dark:border-stone-800/60">
          {/* Left Column: Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Athenaeum
            </span>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif leading-relaxed max-w-sm">
              An independent digital reading room and monograph repository. Dedicated to typography, architectural theory, natural philosophy, and slow literature.
            </p>
            <div className="text-xs text-stone-500 dark:text-stone-400 space-y-1">
              <p>Typefaces set in Cormorant Garamond & Plus Jakarta Sans.</p>
              <p>Designed for clarity, focus, and quiet study.</p>
            </div>
          </div>

          {/* Center Column: Catalog Categories */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-200 block">
              Curated Disciplines
            </span>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
              <li>
                <button
                  onClick={() => handleCategoryClick('Architecture & Design')}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Architecture & Spatial Theory
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Philosophy')}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Classical & Modern Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Science & Technology')}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Cognitive Science & Computing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Literary Fiction')}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Atmospheric Literary Fiction
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Essays & Art')}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Critical Essays & Visual Arts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('History & Civilization')}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  History & Civilization
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Psychology & Mind')}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Psychology & Human Nature
                </button>
              </li>
            </ul>
          </div>

          {/* Right Column: Library Navigation */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-200 block">
              Reader Access
            </span>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
              <li>
                <button
                  onClick={() => onNavigate({ name: 'catalog' })}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Complete Library Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ name: 'curations' })}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Thematic Curations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ name: 'favorites' })}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Personal Bookshelf
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ name: 'explore' })}
                  className="hover:text-stone-950 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Explore Repository
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} Athenaeum Library Archive. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Open Access Repository</span>
            <span aria-hidden="true">·</span>
            <span>Client-side Persistent Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
