import React, { useState, useEffect, useRef } from 'react';
import { Book, BookCategory } from '../types/book';
import { useLibrary } from '../context/LibraryContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Route } from '../hooks/useRouter';
import { BookCover } from './BookCover';
import {
  Search,
  BookOpen,
  Compass,
  Bookmark,
  Sparkles,
  Sun,
  Moon,
  Shuffle,
  Shield,
  Layers,
  ArrowRight,
  CornerDownLeft,
  X,
  Library
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: Route) => void;
  onSelectBook: (bookId: string) => void;
  onStartReading: (bookId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectBook,
  onStartReading
}) => {
  const { books, setSelectedCategory } = useLibrary();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmedQuery = query.trim().toLowerCase();

  // Matched books
  const matchedBooks = trimmedQuery
    ? books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(trimmedQuery) ||
            b.author.toLowerCase().includes(trimmedQuery) ||
            b.category.toLowerCase().includes(trimmedQuery) ||
            b.isbn.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 6)
    : [];

  // Quick navigation items
  const navActions = [
    {
      id: 'nav-catalog',
      label: 'The Library Catalog',
      desc: 'Browse complete archival collection and search live APIs',
      icon: Library,
      category: 'Navigation',
      action: () => {
        onNavigate({ name: 'catalog' });
        onClose();
      }
    },
    {
      id: 'nav-curations',
      label: 'Curated Thematic Pathways',
      desc: 'Structured curricula and syllabi for deep study',
      icon: Compass,
      category: 'Navigation',
      action: () => {
        onNavigate({ name: 'curations' });
        onClose();
      }
    },
    {
      id: 'nav-shelf',
      label: 'My Bookshelf & Saved Volumes',
      desc: 'View your personal reading list, progress and study notes',
      icon: Bookmark,
      category: 'Navigation',
      action: () => {
        onNavigate({ name: 'favorites' });
        onClose();
      }
    },
    {
      id: 'nav-explore',
      label: 'Explore Archives & Disciplines',
      desc: 'Interactive discipline matrix and archival discovery',
      icon: Sparkles,
      category: 'Navigation',
      action: () => {
        onNavigate({ name: 'explore' });
        onClose();
      }
    },
    ...(isAdmin
      ? [
          {
            id: 'nav-admin',
            label: 'Curator Admin Console',
            desc: 'Catalog ingestion, user management, and loan circulation',
            icon: Shield,
            category: 'Navigation',
            action: () => {
              onNavigate({ name: 'admin' });
              onClose();
            }
          }
        ]
      : [])
  ];

  // Quick tools
  const toolActions = [
    {
      id: 'tool-surprise',
      label: 'Surprise Me / Random Volume',
      desc: 'Pick an unexpected volume for contemplation',
      icon: Shuffle,
      category: 'Tools',
      action: () => {
        const random = books[Math.floor(Math.random() * books.length)];
        if (random) onSelectBook(random.id);
        onClose();
      }
    },
    {
      id: 'tool-theme',
      label: `Switch to ${theme === 'light' ? 'Obsidian Dark' : 'Ivory Light'} Theme`,
      desc: 'Adjust visual contrast for day or nocturnal study',
      icon: theme === 'light' ? Moon : Sun,
      category: 'Tools',
      action: () => {
        toggleTheme();
        onClose();
      }
    }
  ];

  // Category quick filters
  const categoryActions: Array<{
    id: string;
    label: string;
    desc: string;
    icon: typeof Layers;
    category: string;
    action: () => void;
  }> = [
    'Philosophy',
    'Architecture & Design',
    'Science & Technology',
    'Literary Fiction',
    'Psychology & Mind',
    'History & Civilization'
  ].map((cat) => ({
    id: `cat-${cat}`,
    label: `Filter: ${cat}`,
    desc: `Browse all works in ${cat}`,
    icon: Layers,
    category: 'Disciplines',
    action: () => {
      setSelectedCategory(cat as BookCategory);
      onNavigate({ name: 'catalog' });
      onClose();
    }
  }));

  const allFilteredActions = [
    ...navActions,
    ...toolActions,
    ...categoryActions
  ].filter(
    (act) =>
      act.label.toLowerCase().includes(trimmedQuery) ||
      act.desc.toLowerCase().includes(trimmedQuery) ||
      act.category.toLowerCase().includes(trimmedQuery)
  );

  // Total selectable items
  const totalItems = matchedBooks.length + allFilteredActions.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (totalItems || 1)) % (totalItems || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < matchedBooks.length) {
        const book = matchedBooks[selectedIndex];
        if (book) {
          onSelectBook(book.id);
          onClose();
        }
      } else {
        const actionIdx = selectedIndex - matchedBooks.length;
        const action = allFilteredActions[actionIdx];
        if (action) {
          action.action();
        }
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 pb-6 bg-stone-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/50">
          <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a book title, author, discipline, or command..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono uppercase text-stone-400 bg-stone-200/70 dark:bg-stone-800 rounded border border-stone-300/60 dark:border-stone-700">
              ESC to close
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4 flex-1">
          {/* 1. Books Section */}
          {matchedBooks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
                Archival Folios ({matchedBooks.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedBooks.map((book, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={book.id}
                      onClick={() => {
                        onSelectBook(book.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 text-stone-950 dark:text-stone-50 ring-1 ring-amber-500/30'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800/70 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-12 shrink-0 rounded overflow-hidden shadow-xs">
                          <BookCover
                            coverImage={book.coverImage}
                            title={book.title}
                            author={book.author}
                            category={book.category}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                            {book.title}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                            {book.author} · <span className="font-serif italic">{book.category}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartReading(book.id);
                            onClose();
                          }}
                          className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Excerpt</span>
                        </button>
                        <ArrowRight className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Commands & Navigation */}
          {allFilteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                Commands & Shortcuts
              </div>
              <div className="space-y-1 mt-1">
                {allFilteredActions.map((action, actIdx) => {
                  const globalIdx = matchedBooks.length + actIdx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = action.icon;

                  return (
                    <div
                      key={action.id}
                      onClick={action.action}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 text-stone-950 dark:text-stone-50 ring-1 ring-amber-500/30'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800/70 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-stone-200/60 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-600 dark:text-stone-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                            {action.label}
                          </div>
                          <div className="text-xs text-stone-400 dark:text-stone-500 truncate">
                            {action.desc}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-stone-400 text-xs shrink-0">
                        <span className="text-[10px] font-mono uppercase bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                          {action.category}
                        </span>
                        {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {matchedBooks.length === 0 && allFilteredActions.length === 0 && (
            <div className="py-12 text-center text-stone-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No matching volumes or commands found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1 text-stone-500">Try searching for an author (e.g. Seneca, Marcus Aurelius) or &ldquo;Philosophy&rdquo;.</p>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-950/50 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Athenaeum Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
};
