import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { ReadingStatus } from '../types/book';
import {
  Bookmark,
  Trash2,
  BookOpen,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  Clock,
  BookCheck
} from 'lucide-react';

interface FavoritesPageProps {
  onSelectBook: (bookId: string) => void;
  onStartReading: (bookId: string) => void;
  onExploreCatalog: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectBook,
  onStartReading,
  onExploreCatalog
}) => {
  const {
    shelfBooks,
    favoriteBooks,
    toggleFavorite,
    getReadingStatus,
    setReadingStatus,
    readingProgress
  } = useLibrary();

  const [shelfFilter, setShelfFilter] = useState<'all' | ReadingStatus>('all');

  // Filter books by shelf filter
  const displayedBooks = (shelfBooks.length > 0 ? shelfBooks : favoriteBooks).filter((book) => {
    if (shelfFilter === 'all') return true;
    const status = getReadingStatus(book.id);
    return status === shelfFilter;
  });

  // Calculate statistics across shelf
  const targetBooks = shelfBooks.length > 0 ? shelfBooks : favoriteBooks;
  const totalHours = targetBooks.reduce((sum, b) => sum + (b.readTimeHours || 4), 0);
  const currentlyReadingCount = targetBooks.filter(
    (b) => getReadingStatus(b.id) === 'currently-reading'
  ).length;
  const completedCount = targetBooks.filter(
    (b) => getReadingStatus(b.id) === 'completed'
  ).length;

  return (
    <div className="py-8 md:py-12 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Top Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-medium mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Collection & Study Log</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
            My Bookshelf & Saved Volumes
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 font-serif italic mt-1">
            Reserved monographs for deep study, ongoing reading, and personal reflection.
          </p>
        </div>

        {/* Aggregate Reading Stats */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2.5 rounded-lg shadow-2xs">
          <div>
            <span className="block text-stone-400 text-[10px] uppercase tracking-wider">
              On Shelf
            </span>
            <span className="font-mono tabular-nums text-sm font-semibold text-stone-900 dark:text-stone-100">
              {targetBooks.length}
            </span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          <div>
            <span className="block text-stone-400 text-[10px] uppercase tracking-wider">
              Reading Now
            </span>
            <span className="font-mono tabular-nums text-sm font-semibold text-amber-700 dark:text-amber-400">
              {currentlyReadingCount}
            </span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          <div>
            <span className="block text-stone-400 text-[10px] uppercase tracking-wider">
              Finished
            </span>
            <span className="font-mono tabular-nums text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          <div>
            <span className="block text-stone-400 text-[10px] uppercase tracking-wider">
              Read Time
            </span>
            <span className="font-mono tabular-nums text-sm font-semibold text-stone-900 dark:text-stone-100">
              ~{totalHours.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Filters Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-stone-200/60 dark:border-stone-800/60 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setShelfFilter('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            shelfFilter === 'all'
              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          All Volumes ({targetBooks.length})
        </button>
        <button
          onClick={() => setShelfFilter('currently-reading')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            shelfFilter === 'currently-reading'
              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Currently Reading ({currentlyReadingCount})</span>
        </button>
        <button
          onClick={() => setShelfFilter('want-to-read')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            shelfFilter === 'want-to-read'
              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Want to Read</span>
        </button>
        <button
          onClick={() => setShelfFilter('completed')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            shelfFilter === 'completed'
              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BookCheck className="w-3.5 h-3.5" />
          <span>Finished ({completedCount})</span>
        </button>
      </div>

      {/* Book List or Empty State */}
      {displayedBooks.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white/50 dark:bg-stone-900/40 rounded-xl border border-dashed border-stone-300 dark:border-stone-800 my-4">
          <Bookmark className="w-8 h-8 mx-auto text-stone-400 mb-3" />
          <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-1">
            {shelfFilter === 'all'
              ? 'Your bookshelf is currently empty'
              : `No books currently classified as "${shelfFilter.replace('-', ' ')}"`}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-6">
            Explore our curated 200 monographs and click the bookmark or status buttons to organize your reading list here.
          </p>
          <button
            onClick={onExploreCatalog}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-md transition-colors cursor-pointer shadow-sm"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedBooks.map((book) => {
            const status = getReadingStatus(book.id);
            const progress = readingProgress[book.id];
            const percent =
              progress && progress.totalPages > 0
                ? Math.min(100, Math.round((progress.currentPage / progress.totalPages) * 100))
                : status === 'completed'
                ? 100
                : 0;

            return (
              <div
                key={book.id}
                className="flex flex-col sm:flex-row gap-5 p-5 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 rounded-xl transition-all hover:border-stone-400 dark:hover:border-stone-600 shadow-2xs hover:shadow-sm"
              >
                {/* Book Cover Thumbnail */}
                <div
                  onClick={() => onSelectBook(book.id)}
                  className="w-28 sm:w-32 shrink-0 cursor-pointer mx-auto sm:mx-0 group"
                >
                  <BookCover
                    coverImage={book.coverImage}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    className="w-full shadow-md rounded-xs group-hover:scale-[1.02] transition-transform duration-200"
                  />
                </div>

                {/* Details & Actions */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                      <span className="truncate">{book.category}</span>
                      <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400 font-medium">
                        ★ {book.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectBook(book.id)}
                      className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer leading-snug line-clamp-1"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-1">
                      {book.subtitle}
                    </p>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                      By {book.author}
                    </p>

                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 pt-1 font-sans">
                      {book.summary}
                    </p>

                    {/* Reading progress bar */}
                    {status === 'currently-reading' && (
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                          <span>
                            p. {progress?.currentPage || 0} of {book.pages}
                          </span>
                          <span>{percent}% read</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls Row */}
                  <div className="pt-3.5 mt-2 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Status dropdown */}
                    <div className="flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-stone-400" />
                      <select
                        value={status || ''}
                        onChange={(e) => {
                          const val = e.target.value as ReadingStatus;
                          setReadingStatus(book.id, val ? val : null);
                        }}
                        className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-2 py-1 text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
                      >
                        <option value="">No Status</option>
                        <option value="want-to-read">Want to Read</option>
                        <option value="currently-reading">Currently Reading</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onStartReading(book.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
                        title="Read excerpt"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Excerpt</span>
                      </button>

                      <button
                        onClick={() => onSelectBook(book.id)}
                        className="px-2.5 py-1 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => toggleFavorite(book.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Remove from favorites"
                        aria-label="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
