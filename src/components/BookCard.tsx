import React from 'react';
import { Book } from '../types/book';
import { BookCover } from './BookCover';
import { useLibrary } from '../context/LibraryContext';
import { Heart, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onSelectBook: (bookId: string) => void;
  onStartReading: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelectBook,
  onStartReading
}) => {
  const { isFavorite, toggleFavorite, getReadingStatus } = useLibrary();
  const favorited = isFavorite(book.id);
  const status = getReadingStatus(book.id);

  return (
    <div className="group relative flex flex-col justify-between h-full bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 rounded-xl p-4 card-elevate hover:border-amber-300/60 dark:hover:border-amber-700/60">
      {/* Top Cover Section */}
      <div className="relative">
        <div
          onClick={() => onSelectBook(book.id)}
          className="cursor-pointer block relative overflow-hidden rounded-sm"
        >
          <BookCover
            coverImage={book.coverImage}
            title={book.title}
            author={book.author}
            category={book.category}
            className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        {/* Favorite Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(book.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer z-20 ${
            favorited
              ? 'bg-amber-500/90 text-white shadow-xs'
              : 'bg-black/30 hover:bg-black/50 text-white/90'
          }`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`}
          />
        </button>

        {/* Quick Reading Status Marker if assigned */}
        {status && (
          <div className="absolute bottom-2 left-2 z-20 bg-stone-900/85 backdrop-blur-xs text-stone-200 text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-sm">
            {status === 'currently-reading'
              ? 'Reading'
              : status === 'completed'
              ? 'Completed'
              : 'Saved'}
          </div>
        )}
      </div>

      {/* Middle Text Details: Clean unboxed metadata with typographic separators */}
      <div className="pt-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Year */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="truncate max-w-[130px]">{book.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{book.publishedYear}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400 font-medium">
              ★ {book.rating.toFixed(1)}
            </span>
          </div>

          {/* Book Title */}
          <h3
            onClick={() => onSelectBook(book.id)}
            className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50 leading-snug line-clamp-1 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors cursor-pointer"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Subtitle / Topic summary */}
          <p className="text-xs text-stone-600 dark:text-stone-300 font-serif italic line-clamp-1 mt-0.5">
            {book.subtitle}
          </p>

          {/* Author */}
          <p className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-1">
            {book.author}
          </p>
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-3.5 mt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-stone-400 font-mono tabular-nums">
            {book.pages} p. · ~{book.readTimeHours}h
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onStartReading(book.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
              title="Open reader excerpt"
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
};
