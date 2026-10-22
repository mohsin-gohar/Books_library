import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { useLibrary } from '../context/LibraryContext';
import {
  X,
  Type,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  BookCheck,
  ArrowRight
} from 'lucide-react';

interface ReaderModalProps {
  book: Book;
  onClose: () => void;
  onSelectBook?: (bookId: string) => void;
}

type PaperTone = 'warm-paper' | 'clean-white' | 'midnight';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';
type FontStyle = 'serif' | 'sans';

export const ReaderModal: React.FC<ReaderModalProps> = ({
  book,
  onClose,
  onSelectBook
}) => {
  const { isFavorite, toggleFavorite, books, getReadingStatus, setReadingStatus, showToast } = useLibrary();
  const favorited = isFavorite(book.id);
  const currentStatus = getReadingStatus(book.id);

  const [paperTone, setPaperTone] = useState<PaperTone>('warm-paper');
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [fontStyle, setFontStyle] = useState<FontStyle>('serif');
  const [showSettings, setShowSettings] = useState(false);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Background and text color mapping for reader mode
  const getPaperClasses = () => {
    switch (paperTone) {
      case 'warm-paper':
        return 'bg-[#F9F6F0] text-[#2C2825] border-stone-300/80';
      case 'clean-white':
        return 'bg-white text-stone-900 border-stone-200';
      case 'midnight':
        return 'bg-[#121214] text-[#E0E0E2] border-stone-800';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base leading-relaxed';
      case 'base':
        return 'text-lg leading-relaxed';
      case 'lg':
        return 'text-xl leading-loose';
      case 'xl':
        return 'text-2xl leading-loose';
    }
  };

  // Find next/prev book for reader cycling
  const currentIndex = books.findIndex((b) => b.id === book.id);
  const prevBook = currentIndex > 0 ? books[currentIndex - 1] : null;
  const nextBook = currentIndex < books.length - 1 ? books[currentIndex + 1] : null;

  const handleMarkCompleted = () => {
    setReadingStatus(book.id, 'completed');
    showToast(`Marked "${book.title}" as Completed`);
  };

  const handleMarkCurrentlyReading = () => {
    setReadingStatus(book.id, 'currently-reading');
    showToast(`Marked "${book.title}" as Currently Reading`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl min-h-[85vh] rounded-xl shadow-2xl flex flex-col border transition-colors ${getPaperClasses()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest opacity-60 font-medium">
              Athenaeum Reading Room
            </span>
            <span className="opacity-30">·</span>
            <span id="reader-title" className="text-xs font-serif italic truncate max-w-[200px] sm:max-w-xs">
              {book.title}
            </span>
            {currentStatus && (
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 opacity-75">
                {currentStatus.replace('-', ' ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Typography Settings Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Typography & Appearance"
              aria-label="Typography and appearance settings"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Type</span>
            </button>

            {/* Favorite toggle inside reader */}
            <button
              onClick={() => toggleFavorite(book.id)}
              className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title={favorited ? 'In Favorites' : 'Add to Favorites'}
            >
              <Bookmark
                className={`w-4 h-4 ${favorited ? 'fill-amber-600 text-amber-600' : ''}`}
              />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ml-1"
              aria-label="Close reading room"
              title="Close reading room (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Typography Settings Drawer */}
        {showSettings && (
          <div className="px-6 py-4 border-b border-inherit bg-black/5 dark:bg-white/5 flex flex-wrap items-center justify-between gap-4 text-xs animate-fadeIn">
            {/* Font Style */}
            <div className="flex items-center gap-2">
              <span className="opacity-70 font-medium">Typeface:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFontStyle('serif')}
                  className={`px-3 py-1 rounded font-serif ${
                    fontStyle === 'serif'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => setFontStyle('sans')}
                  className={`px-3 py-1 rounded font-sans ${
                    fontStyle === 'sans'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  Sans
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2">
              <span className="opacity-70 font-medium">Scale:</span>
              <div className="flex items-center gap-1 font-mono">
                {(['sm', 'base', 'lg', 'xl'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2.5 py-1 rounded uppercase text-[11px] ${
                      fontSize === size
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Tone */}
            <div className="flex items-center gap-2">
              <span className="opacity-70 font-medium">Tone:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaperTone('warm-paper')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded ${
                    paperTone === 'warm-paper'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  title="Warm Sepia Linen"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Warm</span>
                </button>
                <button
                  onClick={() => setPaperTone('clean-white')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded ${
                    paperTone === 'clean-white'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  title="Clean Crisp White"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>White</span>
                </button>
                <button
                  onClick={() => setPaperTone('midnight')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded ${
                    paperTone === 'midnight'
                      ? 'bg-stone-100 text-stone-900'
                      : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  title="Midnight Obsidian"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reader Prose Content */}
        <div className="flex-1 px-6 sm:px-12 md:px-20 py-10 md:py-16 overflow-y-auto max-w-3xl mx-auto w-full">
          {/* Chapter Heading */}
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs uppercase tracking-widest opacity-60 font-sans block">
              Chapter Excerpt · {book.edition || 'First Clothbound Edition'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              {book.sampleExcerpt.chapterTitle || 'Chapter I'}
            </h2>
            {book.sampleExcerpt.subtitle && (
              <p className="text-sm sm:text-base font-serif italic opacity-75">
                {book.sampleExcerpt.subtitle}
              </p>
            )}
            <div className="w-12 h-px bg-current opacity-30 mx-auto pt-2" />
          </div>

          {/* Paragraphs */}
          <div
            className={`space-y-6 ${
              fontStyle === 'serif' ? 'font-serif' : 'font-sans'
            } ${getFontSizeClass()}`}
          >
            {book.sampleExcerpt.paragraphs && book.sampleExcerpt.paragraphs.length > 0 ? (
              book.sampleExcerpt.paragraphs.map((para, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? 'first-letter:text-5xl first-letter:font-serif first-letter:mr-2.5 first-letter:float-left first-letter:leading-none'
                      : ''
                  }
                >
                  {para}
                </p>
              ))
            ) : (
              <p className="italic opacity-80 text-center py-8">
                “{book.quote}” — {book.summary}
              </p>
            )}
          </div>

          {/* Editorial separator & book signature */}
          <div className="mt-16 pt-8 border-t border-inherit text-center space-y-4">
            <p className="text-xs uppercase tracking-wider opacity-60 font-sans">
              End of Preserved Chapter Excerpt
            </p>
            <p className="font-serif italic text-base opacity-90">
              {book.title} — Written by {book.author}
            </p>
            <p className="text-xs font-mono opacity-60 tabular-nums">
              Complete monograph spans {book.pages} pages (~{book.readTimeHours} hrs reading time)
            </p>

            {/* Quick shelf status actions at the end of excerpt */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {currentStatus !== 'completed' ? (
                <button
                  onClick={handleMarkCompleted}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors cursor-pointer shadow-2xs"
                >
                  <BookCheck className="w-3.5 h-3.5" />
                  <span>Mark as Finished Reading</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed on Bookshelf</span>
                </div>
              )}

              {currentStatus !== 'currently-reading' && currentStatus !== 'completed' && (
                <button
                  onClick={handleMarkCurrentlyReading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Mark as Currently Reading</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Pagination & Next Book Carousel */}
        <div className="px-6 py-4 border-t border-inherit flex items-center justify-between text-xs shrink-0">
          <div>
            {prevBook ? (
              <button
                onClick={() => onSelectBook && onSelectBook(prevBook.id)}
                className="flex items-center gap-1.5 hover:opacity-100 opacity-70 transition-opacity cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous:</span>
                <span className="font-serif italic truncate max-w-[140px]">
                  {prevBook.title}
                </span>
              </button>
            ) : (
              <div />
            )}
          </div>

          <div className="text-center font-mono opacity-60 tabular-nums text-[11px]">
            Press <kbd className="px-1.5 py-0.5 border border-inherit rounded font-sans text-[10px]">Esc</kbd> to exit reading room
          </div>

          <div>
            {nextBook ? (
              <button
                onClick={() => onSelectBook && onSelectBook(nextBook.id)}
                className="flex items-center gap-1.5 hover:opacity-100 opacity-70 transition-opacity cursor-pointer"
              >
                <span className="hidden sm:inline">Next:</span>
                <span className="font-serif italic truncate max-w-[140px]">
                  {nextBook.title}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
