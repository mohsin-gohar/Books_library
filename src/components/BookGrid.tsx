import React from 'react';
import { Book } from '../types/book';
import { BookCard } from './BookCard';
import { BookCover } from './BookCover';
import { useLibrary } from '../context/LibraryContext';
import {
  BookX,
  ChevronLeft,
  ChevronRight,
  Heart,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onSelectBook: (bookId: string) => void;
  onStartReading: (bookId: string) => void;
  onResetFilters: () => void;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  onSelectBook,
  onStartReading,
  onResetFilters
}) => {
  const {
    viewMode,
    currentPage,
    setCurrentPage,
    totalPagesCount,
    paginatedBooks,
    isFavorite,
    toggleFavorite,
    getReadingStatus
  } = useLibrary();

  if (books.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white/50 dark:bg-stone-900/40 rounded-lg border border-dashed border-stone-300 dark:border-stone-800 my-8">
        <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400 mb-4">
          <BookX className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-1">
          No matching volumes found
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
          We couldn’t find any books matching your current search query or active category criteria among our 200 volumes.
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer"
        >
          Reset Search & Filter Criteria
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 1. TACTILE COVER GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {paginatedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelectBook={onSelectBook}
              onStartReading={onStartReading}
            />
          ))}
        </div>
      )}

      {/* 2. DETAILED SHELF / HORIZONTAL CARD VIEW */}
      {viewMode === 'shelf' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {paginatedBooks.map((book) => {
            const favorited = isFavorite(book.id);
            const status = getReadingStatus(book.id);

            return (
              <div
                key={book.id}
                className="group flex flex-col sm:flex-row gap-5 p-5 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 rounded-lg hover:border-stone-400 dark:hover:border-stone-600 transition-all shadow-2xs hover:shadow-sm"
              >
                <div
                  onClick={() => onSelectBook(book.id)}
                  className="w-28 sm:w-32 shrink-0 cursor-pointer mx-auto sm:mx-0 group-hover:scale-[1.02] transition-transform duration-200"
                >
                  <BookCover
                    coverImage={book.coverImage}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    className="w-full shadow-md rounded-xs"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                      <span className="truncate">{book.category}</span>
                      <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400 font-medium">
                        ★ {book.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectBook(book.id)}
                      className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer leading-snug line-clamp-1"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-serif italic line-clamp-1">
                      {book.subtitle}
                    </p>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-0.5">
                      By {book.author}
                    </p>

                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-2 leading-relaxed">
                      {book.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2 text-xs">
                    <span className="text-stone-400 font-mono tabular-nums text-[11px]">
                      {book.pages} p. · {book.publishedYear}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(book.id)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          favorited
                            ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60'
                            : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                        }`}
                        title={favorited ? 'In Favorites' : 'Add to Favorites'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`}
                        />
                      </button>

                      <button
                        onClick={() => onStartReading(book.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. ARCHIVAL INDEX LIST / LEDGER VIEW */}
      {viewMode === 'compact' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-x-auto shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4 font-semibold">Volume & Subtitle</th>
                <th className="py-3 px-4 font-semibold">Author</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-right">Year</th>
                <th className="py-3 px-4 font-semibold text-right">Pages</th>
                <th className="py-3 px-4 font-semibold text-right">Rating</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
              {paginatedBooks.map((book) => {
                const favorited = isFavorite(book.id);

                return (
                  <tr
                    key={book.id}
                    onClick={() => onSelectBook(book.id)}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
                        {book.title}
                      </div>
                      <div className="text-stone-500 font-serif italic text-xs truncate max-w-sm">
                        {book.subtitle}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-700 dark:text-stone-300 font-medium whitespace-nowrap">
                      {book.author}
                    </td>
                    <td className="py-3 px-4 text-stone-500 dark:text-stone-400 whitespace-nowrap">
                      {book.category}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-stone-600 dark:text-stone-300 text-right whitespace-nowrap">
                      {book.publishedYear}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-stone-600 dark:text-stone-300 text-right whitespace-nowrap">
                      {book.pages} p.
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-amber-700 dark:text-amber-400 font-medium text-right whitespace-nowrap">
                      ★ {book.rating.toFixed(1)}
                    </td>
                    <td
                      className="py-3 px-4 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => toggleFavorite(book.id)}
                          className={`p-1.5 rounded transition-colors ${
                            favorited
                              ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60'
                              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                          }`}
                          title={favorited ? 'In Favorites' : 'Add to Favorites'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`}
                          />
                        </button>
                        <button
                          onClick={() => onStartReading(book.id)}
                          className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
                          title="Read excerpt"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectBook(book.id)}
                          className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
                          title="Open volume details"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPagesCount > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/80 dark:border-stone-800/80">
          <div className="text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
            Page {currentPage} of {totalPagesCount} ({books.length} matching volumes)
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCurrentPage(Math.max(1, currentPage - 1));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1 font-mono text-xs">
              {Array.from({ length: totalPagesCount }).map((_, idx) => {
                const pageNum = idx + 1;
                // Only show a sliding window if there are many pages
                if (
                  totalPagesCount > 7 &&
                  Math.abs(pageNum - currentPage) > 2 &&
                  pageNum !== 1 &&
                  pageNum !== totalPagesCount
                ) {
                  if (
                    (pageNum === 2 && currentPage > 4) ||
                    (pageNum === totalPagesCount - 1 && currentPage < totalPagesCount - 3)
                  ) {
                    return (
                      <span key={pageNum} className="px-1 text-stone-400">
                        …
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-md font-medium transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage(Math.min(totalPagesCount, currentPage + 1));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPagesCount}
              className="p-2 rounded-md border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
