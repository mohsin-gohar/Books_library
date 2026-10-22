import React, { useState, useEffect } from 'react';
import { Book, ReadingStatus } from '../types/book';
import { BookCover } from './BookCover';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import {
  ArrowLeft,
  Heart,
  BookOpen,
  Share2,
  Check,
  Star,
  MessageSquarePlus,
  BookMarked,
  FileText,
  Save,
  Download,
  Truck,
  X,
  Package,
  ShieldCheck
} from 'lucide-react';

interface BookDetailPageProps {
  book: Book;
  onBack: () => void;
  onStartReading: (bookId: string) => void;
  onSelectRelatedBook: (bookId: string) => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  book,
  onBack,
  onStartReading,
  onSelectRelatedBook
}) => {
  const {
    books,
    isFavorite,
    toggleFavorite,
    getReadingStatus,
    setReadingStatus,
    addReview,
    getUserNote,
    saveUserNote,
    showToast
  } = useLibrary();
  const { user } = useAuth();
  const { placeOrder } = useOrders();

  const favorited = isFavorite(book.id);
  const currentStatus = getReadingStatus(book.id);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRole, setReviewRole] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Delivery Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderAddress, setOrderAddress] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Private study note state
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setNoteText(getUserNote(book.id));
  }, [book.id, getUserNote]);

  const handleSaveNote = () => {
    saveUserNote(book.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadExcerpt = () => {
    const textContent = `${book.title.toUpperCase()}
By ${book.author}
Category: ${book.category}
ISBN: ${book.isbn}

${book.sampleExcerpt.chapterTitle}
${book.sampleExcerpt.subtitle || ''}

${book.sampleExcerpt.paragraphs.join('\n\n')}

---
Preserved by Athenaeum Library Repository`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.id}-excerpt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    addReview(
      book.id,
      reviewAuthor.trim() || 'Fellow Reader',
      reviewRole.trim() || 'Scholar',
      reviewRating,
      reviewContent
    );
    setReviewContent('');
    setReviewAuthor('');
    setReviewRole('');
    setShowReviewForm(false);
  };

  // Find related books from same category across the 200 catalog
  const relatedBooks = books
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4);

  return (
    <div className="py-8 md:py-12 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Top back navigation & quick share */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadExcerpt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md transition-colors cursor-pointer"
            title="Download text excerpt"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Excerpt</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md transition-colors cursor-pointer"
            title="Copy book permalink"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Single-Elevation Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Cover, Reading Status, Technical Specs & Study Notes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="max-w-sm mx-auto lg:max-w-none">
            <BookCover
              coverImage={book.coverImage}
              title={book.title}
              author={book.author}
              category={book.category}
              className="w-full shadow-2xl rounded-xs"
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onStartReading(book.id)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Sample Excerpt</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(book.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  favorited
                    ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200'
                    : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${favorited ? 'fill-current text-amber-700 dark:text-amber-400' : ''}`}
                />
                <span>{favorited ? 'Saved in Favorites' : 'Add to Favorites'}</span>
              </button>

              {/* Reading Status Selector Dropdown */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-2 text-xs">
                <BookMarked className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={currentStatus || ''}
                  onChange={(e) => {
                    const val = e.target.value as ReadingStatus;
                    setReadingStatus(book.id, val ? val : null);
                  }}
                  className="bg-transparent text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="">Shelf Status</option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setShowOrderModal(true);
                setOrderSuccess(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 transition-colors cursor-pointer shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>Order Physical Volume for Delivery</span>
            </button>
          </div>

          {/* Book Specifications Grid */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-4">
              Volume Specifications
            </h3>
            <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-sans">
              <div>
                <dt className="text-stone-400">Publisher</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-200 mt-0.5">
                  {book.publisher}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">Publication Year</dt>
                <dd className="font-mono tabular-nums font-medium text-stone-800 dark:text-stone-200 mt-0.5">
                  {book.publishedYear}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">ISBN</dt>
                <dd className="font-mono tabular-nums text-stone-800 dark:text-stone-200 mt-0.5">
                  {book.isbn}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">Extent</dt>
                <dd className="font-mono tabular-nums text-stone-800 dark:text-stone-200 mt-0.5">
                  {book.pages} pages (~{book.readTimeHours} hrs)
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">Language</dt>
                <dd className="text-stone-800 dark:text-stone-200 mt-0.5">
                  {book.language}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">Edition</dt>
                <dd className="text-stone-800 dark:text-stone-200 mt-0.5">
                  {book.edition || 'Library Clothbound Edition'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Personal Reader Notes (Persistent in localStorage) */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>My Private Study Notes</span>
              </span>
              {noteSaved && (
                <span className="text-[11px] text-emerald-600 font-medium">Saved</span>
              )}
            </div>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record your thoughts, quotes to remember, or questions for further study..."
              className="w-full p-2.5 text-xs bg-stone-100/60 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 focus:outline-none resize-none placeholder:text-stone-400"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded transition-colors cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Author, Synopsis, Quote, TOC, Reviews */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
              <span>{book.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">★ {book.rating.toFixed(1)}</span>
              <span className="text-stone-400">({book.ratingCount} evaluations)</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 dark:text-stone-50 leading-[1.15]">
              {book.title}
            </h1>

            <p className="font-serif text-lg sm:text-xl text-stone-600 dark:text-stone-300 italic">
              {book.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <span className="font-medium">Written by {book.author}</span>
            </div>
          </div>

          {/* Author Bio */}
          <div className="p-4 rounded-md bg-stone-100/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800/80 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            <span className="font-medium text-stone-900 dark:text-stone-200 block mb-1">
              About the Author
            </span>
            {book.authorBio}
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              Curator’s Synopsis
            </h2>
            <p className="font-sans text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              {book.summary}
            </p>
          </div>

          {/* Key Quote Callout - clean subtle surface, no thick border-l-4 */}
          <div className="p-5 rounded-lg bg-stone-100/90 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
            <p className="font-serif text-base sm:text-lg italic text-stone-800 dark:text-stone-200 leading-relaxed">
              “{book.quote}”
            </p>
            {book.quoteAttribution && (
              <p className="text-xs font-sans text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                — {book.quoteAttribution}
              </p>
            )}
          </div>

          {/* Table of Contents */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              Table of Contents
            </h2>
            <ol className="divide-y divide-stone-200/70 dark:divide-stone-800/70 border-y border-stone-200/70 dark:border-stone-800/70 text-sm">
              {book.tableOfContents.map((chapter, idx) => (
                <li
                  key={idx}
                  className="py-2.5 flex items-center justify-between text-stone-700 dark:text-stone-300"
                >
                  <span className="font-serif">{chapter}</span>
                  <span className="text-xs font-mono text-stone-400 tabular-nums">
                    {(idx + 1) * 38}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Reader Reflections & Reviews */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                  Reader Reflections & Reviews
                </h2>
                <span className="text-xs text-stone-400">
                  Average score: {book.rating.toFixed(1)} out of 5 ({book.ratingCount} evaluations)
                </span>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Cancel' : 'Write Reflection'}</span>
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Sterling"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Role or Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Reader, Designer, Student"
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= reviewRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-stone-300 dark:text-stone-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono tabular-nums text-stone-500 ml-2">
                      {reviewRating} of 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Your Reflection
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your thoughts on the thesis, writing style, or emotional resonance..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Publish Reflection
                  </button>
                </div>
              </form>
            )}

            {/* List of Reviews */}
            <div className="space-y-3">
              {book.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-md bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {rev.author}
                      </span>
                      <span className="text-[11px] text-stone-400 ml-2">
                        · {rev.role}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="ml-1.5 text-[10px] text-stone-400 font-mono">
                        {rev.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                    “{rev.content}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Volumes */}
          {relatedBooks.length > 0 && (
            <div className="pt-8 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                Related Volumes in {book.category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedBooks.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedBook(rel.id)}
                    className="p-3 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 rounded-md cursor-pointer hover:border-stone-400 dark:hover:border-stone-600 transition-colors group"
                  >
                    <BookCover
                      coverImage={rel.coverImage}
                      title={rel.title}
                      author={rel.author}
                      category={rel.category}
                      className="w-full mb-2.5 rounded-xs"
                    />
                    <h4 className="font-serif text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {rel.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order for Delivery Modal */}
      {showOrderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowOrderModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {!user ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Reader Account Required
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif leading-relaxed max-w-sm mx-auto">
                  Physical volume delivery orders are tied to your Athenaeum reader account so you can track parcel dispatch, shipping status, and delivery history.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      window.location.hash = '#/login';
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    Sign In to Account
                  </button>
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      window.location.hash = '#/register';
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </div>
              </div>
            ) : orderSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Order Dispatched for Packing
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif leading-relaxed max-w-sm mx-auto">
                  Your physical loan order for <strong className="text-stone-900 dark:text-stone-100">{book.title}</strong> (Quantity: {orderQty}) has been scheduled. Our preservation courier will dispatch the volume to your shipping address.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      window.location.hash = '#/account';
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    View in My Orders
                  </button>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Return to Volume
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!orderAddress.trim()) {
                    showToast('Please provide your delivery address.');
                    return;
                  }
                  const order = placeOrder(book.id, book.title, orderQty, orderAddress.trim());
                  if (order) {
                    setOrderSuccess(true);
                    showToast(`Order placed for "${book.title}"`);
                  }
                }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                        Order Physical Volume
                      </h3>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        Complimentary archival shipping to your desk
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Selected volume snapshot */}
                <div className="p-3 rounded-lg bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800/80 flex items-center gap-3">
                  <div className="w-12 shrink-0">
                    <BookCover
                      coverImage={book.coverImage}
                      title={book.title}
                      author={book.author}
                      category={book.category}
                      className="w-full rounded-2xs shadow-2xs"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {book.author} · {book.edition || 'Clothbound Edition'}
                    </p>
                    <p className="text-[11px] font-mono text-stone-400">
                      ISBN: {book.isbn} · Extent: {book.pages} pages
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-medium">
                      Quantity
                    </label>
                    <select
                      value={orderQty}
                      onChange={(e) => setOrderQty(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none cursor-pointer"
                    >
                      <option value={1}>1 copy</option>
                      <option value={2}>2 copies</option>
                      <option value={3}>3 copies</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-medium">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.name}
                      className="w-full px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-medium">
                    Delivery Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                    placeholder="Street address, apartment or suite, city, postal code..."
                    className="w-full px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Archival Packaging & Courier</span>
                  </div>
                  <span className="font-mono font-semibold uppercase text-[11px] text-amber-800 dark:text-amber-300">
                    Complimentary Loan
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    Confirm Delivery Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
