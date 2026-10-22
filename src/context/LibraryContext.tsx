import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Book,
  BookCategory,
  ReadingProgress,
  ReadingStatus,
  SortOption,
  ViewMode,
  DurationFilter,
  EraFilter
} from '../types/book';
import { BOOKS_DATA } from '../data/books';
import {
  searchBooksApi,
  fetchCategoryBooksFromApi,
  fetchPopularApiBooks
} from '../services/booksApi';

interface LibraryContextType {
  books: Book[];
  favoriteIds: string[];
  readingProgress: Record<string, ReadingProgress>;
  userNotes: Record<string, string>;
  searchQuery: string;
  selectedCategory: BookCategory;
  sortBy: SortOption;
  viewMode: ViewMode;
  durationFilter: DurationFilter;
  eraFilter: EraFilter;
  currentPage: number;
  pageSize: number;
  activeToast: string | null;
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  setReadingStatus: (bookId: string, status: ReadingStatus | null) => void;
  getReadingStatus: (bookId: string) => ReadingStatus | null;
  saveUserNote: (bookId: string, note: string) => void;
  getUserNote: (bookId: string) => string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: BookCategory) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setDurationFilter: (filter: DurationFilter) => void;
  setEraFilter: (filter: EraFilter) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  addReview: (bookId: string, author: string, role: string, rating: number, content: string) => void;
  dismissToast: () => void;
  showToast: (msg: string) => void;
  addBook: (book: Book) => void;
  importBooks: (newBooks: Book[]) => number;
  updateBook: (bookId: string, patch: Partial<Book>) => void;
  deleteBook: (bookId: string) => void;
  batchDeleteBooks: (bookIds: string[]) => void;
  resetCatalog: () => void;
  filteredBooks: Book[];
  paginatedBooks: Book[];
  totalPagesCount: number;
  favoriteBooks: Book[];
  shelfBooks: Book[];
  isApiSearching: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);
const CATALOG_VERSION = 'v4_real_covers';

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const version = localStorage.getItem('athenaeum_catalog_version');
      if (version === CATALOG_VERSION) {
        const stored = localStorage.getItem('athenaeum_books');
        if (stored) {
          const parsed = JSON.parse(stored) as Book[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            const seen = new Set<string>();
            const unique = parsed.filter((b) => {
              if (!b || !b.id || seen.has(b.id)) return false;
              seen.add(b.id);
              return true;
            });
            if (unique.length > 0) return unique;
          }
        }
      } else {
        localStorage.setItem('athenaeum_catalog_version', CATALOG_VERSION);
      }
    } catch {
      // ignore
    }
    return BOOKS_DATA;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem('athenaeum_view_mode');
      if (stored === 'grid' || stored === 'shelf' || stored === 'compact') return stored;
      return 'grid';
    } catch {
      return 'grid';
    }
  });
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [eraFilter, setEraFilter] = useState<EraFilter>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [isApiSearching, setIsApiSearching] = useState<boolean>(false);

  // 1. Initial background catalog enrichment from Books API
  useEffect(() => {
    let cancelled = false;
    const loadInitialApiBooks = async () => {
      try {
        setIsApiSearching(true);
        const apiBooks = await fetchPopularApiBooks();
        if (!cancelled && apiBooks && apiBooks.length > 0) {
          setBooks((prev) => {
            const existingIds = new Set(prev.map((b) => b.id));
            const newBooks = apiBooks.filter((b) => !existingIds.has(b.id));
            if (newBooks.length === 0) return prev;
            return [...newBooks, ...prev];
          });
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setIsApiSearching(false);
      }
    };
    loadInitialApiBooks();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Dynamic live query from Books API when user searches in the catalog
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;

    setIsApiSearching(true);
    const timer = setTimeout(async () => {
      try {
        const apiBooks = await searchBooksApi(q, 16);
        if (apiBooks.length > 0) {
          setBooks((prev) => {
            const existingIds = new Set(prev.map((b) => b.id));
            const existingIsbns = new Set(prev.map((b) => b.isbn).filter(Boolean));
            const newBooks = apiBooks.filter(
              (b) => !existingIds.has(b.id) && (!b.isbn || !existingIsbns.has(b.isbn))
            );
            if (newBooks.length === 0) return prev;
            return [...newBooks, ...prev];
          });
        }
      } catch (err) {
        console.warn('Live API search error in catalog:', err);
      } finally {
        setIsApiSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. Dynamic category books fetch from OpenLibrary subjects API
  useEffect(() => {
    if (selectedCategory === 'All') return;

    setIsApiSearching(true);
    const timer = setTimeout(async () => {
      try {
        const apiBooks = await fetchCategoryBooksFromApi(selectedCategory, 12);
        if (apiBooks.length > 0) {
          setBooks((prev) => {
            const existingIds = new Set(prev.map((b) => b.id));
            const existingIsbns = new Set(prev.map((b) => b.isbn).filter(Boolean));
            const newBooks = apiBooks.filter(
              (b) => !existingIds.has(b.id) && (!b.isbn || !existingIsbns.has(b.isbn))
            );
            if (newBooks.length === 0) return prev;
            return [...prev, ...newBooks];
          });
        }
      } catch (err) {
        console.warn('Live API category fetch error in catalog:', err);
      } finally {
        setIsApiSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Persist books (including admin edits) to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('athenaeum_books', JSON.stringify(books));
    } catch {
      // ignore quota errors
    }
  }, [books]);

  const [activeToast, setActiveToast] = useState<string | null>(null);

  // User private notes on books
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('athenaeum_notes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Initialize favorites from localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('athenaeum_favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((id: string) => (id === 'form-and-void' ? 'form-void' : id));
        }
      }
      return ['form-void', 'meditations-on-time', 'the-zen-garden', 'celestial-mechanics'];
    } catch {
      return ['form-void', 'meditations-on-time', 'the-zen-garden', 'celestial-mechanics'];
    }
  });

  // Reading progress / bookshelf state
  const [readingProgress, setReadingProgress] = useState<Record<string, ReadingProgress>>(() => {
    try {
      const stored = localStorage.getItem('athenaeum_shelf');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const migrated: Record<string, ReadingProgress> = {};
          for (const [key, value] of Object.entries(parsed)) {
            const newKey = key === 'form-and-void' ? 'form-void' : key;
            migrated[newKey] = value && typeof value === 'object' ? { ...(value as ReadingProgress), bookId: newKey } : (value as ReadingProgress);
          }
          return migrated;
        }
      }
      return {
        'form-void': {
          bookId: 'form-void',
          status: 'currently-reading',
          currentPage: 84,
          totalPages: 348,
          lastReadDate: 'Yesterday'
        },
        'meditations-on-time': {
          bookId: 'meditations-on-time',
          status: 'want-to-read',
          currentPage: 0,
          totalPages: 320,
          lastReadDate: '3 days ago'
        },
        'celestial-mechanics': {
          bookId: 'celestial-mechanics',
          status: 'want-to-read',
          currentPage: 0,
          totalPages: 410,
          lastReadDate: 'Just now'
        }
      };
    } catch {
      return {};
    }
  });

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('athenaeum_favorites', JSON.stringify(favoriteIds));
    } catch {
      // ignore
    }
  }, [favoriteIds]);

  // Persist shelf progress
  useEffect(() => {
    try {
      localStorage.setItem('athenaeum_shelf', JSON.stringify(readingProgress));
    } catch {
      // ignore
    }
  }, [readingProgress]);

  // Persist view mode
  useEffect(() => {
    try {
      localStorage.setItem('athenaeum_view_mode', viewMode);
    } catch {
      // ignore
    }
  }, [viewMode]);

  // Persist notes
  useEffect(() => {
    try {
      localStorage.setItem('athenaeum_notes', JSON.stringify(userNotes));
    } catch {
      // ignore
    }
  }, [userNotes]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, durationFilter, eraFilter, pageSize]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  const showToast = useCallback((msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast((current) => (current === msg ? null : current));
    }, 2800);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const isFavorite = useCallback(
    (bookId: string) => favoriteIds.includes(bookId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (bookId: string) => {
      const book = books.find((b) => b.id === bookId);
      const title = book ? `"${book.title}"` : 'Volume';

      setFavoriteIds((prev) => {
        if (prev.includes(bookId)) {
          showToast(`Removed ${title} from Favorites`);
          return prev.filter((id) => id !== bookId);
        } else {
          showToast(`Added ${title} to Favorites`);
          return [...prev, bookId];
        }
      });
    },
    [books, showToast]
  );

  const setReadingStatus = useCallback(
    (bookId: string, status: ReadingStatus | null) => {
      const book = books.find((b) => b.id === bookId);
      const title = book ? `"${book.title}"` : 'Volume';

      setReadingProgress((prev) => {
        const next = { ...prev };
        if (status === null) {
          delete next[bookId];
          showToast(`Removed ${title} from shelf`);
        } else {
          next[bookId] = {
            bookId,
            status,
            currentPage: prev[bookId]?.currentPage || 0,
            totalPages: book?.pages || 300,
            lastReadDate: 'Just now'
          };
          const label =
            status === 'currently-reading'
              ? 'Currently Reading'
              : status === 'completed'
              ? 'Finished'
              : 'Want to Read';
          showToast(`Marked ${title} as ${label}`);
        }
        return next;
      });
    },
    [books, showToast]
  );

  const getReadingStatus = useCallback(
    (bookId: string): ReadingStatus | null => {
      return readingProgress[bookId]?.status || null;
    },
    [readingProgress]
  );

  const saveUserNote = useCallback((bookId: string, note: string) => {
    setUserNotes((prev) => ({
      ...prev,
      [bookId]: note
    }));
    showToast('Reading reflection saved to volume');
  }, [showToast]);

  const getUserNote = useCallback((bookId: string) => {
    return userNotes[bookId] || '';
  }, [userNotes]);

  const addReview = useCallback(
    (bookId: string, author: string, role: string, rating: number, content: string) => {
      setBooks((prev) =>
        prev.map((book) => {
          if (book.id !== bookId) return book;
          const newReview = {
            id: `rev-${Date.now()}`,
            author: author.trim() || 'Reader',
            role: role.trim() || 'Reader',
            rating,
            date: 'Today',
            content: content.trim()
          };
          const updatedReviews = [newReview, ...book.reviews];
          const newCount = book.ratingCount + 1;
          const newRating = Number(
            (
              (book.rating * book.ratingCount + rating) /
              newCount
            ).toFixed(1)
          );
          return {
            ...book,
            rating: newRating,
            ratingCount: newCount,
            reviews: updatedReviews
          };
        })
      );
      showToast('Thank you! Your reflection was published.');
    },
    [showToast]
  );

  const addBook = useCallback((book: Book) => {
    setBooks((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      return [book, ...prev];
    });
    showToast(`“${book.title}” added to the catalog.`);
  }, [showToast]);

  const updateBook = useCallback((bookId: string, patch: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, ...patch } : b))
    );
    showToast('Book updated successfully.');
  }, [showToast]);

  const importBooks = useCallback((newBooks: Book[]) => {
    let countAdded = 0;
    setBooks((prev) => {
      const existingIds = new Set(prev.map((b) => b.id));
      const existingIsbns = new Set(prev.map((b) => b.isbn).filter(Boolean));
      const filtered = newBooks.filter((b) => !existingIds.has(b.id) && (!b.isbn || !existingIsbns.has(b.isbn)));
      countAdded = filtered.length;
      if (countAdded === 0) return prev;
      return [...filtered, ...prev];
    });
    if (countAdded > 0) {
      showToast(`Imported ${countAdded} volumes into the Athenaeum catalog.`);
    } else {
      showToast('All volumes are already present in the catalog.');
    }
    return countAdded;
  }, [showToast]);

  const deleteBook = useCallback((bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setFavoriteIds((prev) => prev.filter((id) => id !== bookId));
    showToast('Book removed from the catalog.');
  }, [showToast]);

  const batchDeleteBooks = useCallback((bookIds: string[]) => {
    if (!bookIds.length) return;
    const idSet = new Set(bookIds);
    setBooks((prev) => prev.filter((b) => !idSet.has(b.id)));
    setFavoriteIds((prev) => prev.filter((id) => !idSet.has(id)));
    showToast(`Removed ${bookIds.length} volumes from the catalog.`);
  }, [showToast]);

  const resetCatalog = useCallback(() => {
    setBooks(BOOKS_DATA);
    try {
      localStorage.removeItem('athenaeum_custom_catalog');
    } catch { /* ignore */ }
    showToast('Catalog restored to default archival collection.');
  }, [showToast]);
  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      // Category filter
      if (selectedCategory !== 'All' && book.category !== selectedCategory) {
        return false;
      }
      // Duration filter
      if (durationFilter === 'short' && book.readTimeHours >= 5) return false;
      if (durationFilter === 'medium' && (book.readTimeHours < 5 || book.readTimeHours > 10)) return false;
      if (durationFilter === 'long' && book.readTimeHours <= 10) return false;

      // Era filter
      if (eraFilter === 'classical' && book.publishedYear >= 1950) return false;
      if (eraFilter === 'modern' && (book.publishedYear < 1950 || book.publishedYear > 2015)) return false;
      if (eraFilter === 'contemporary' && book.publishedYear <= 2015) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesSub = book.subtitle.toLowerCase().includes(q);
        const matchesTag = book.tags.some((t) => t.toLowerCase().includes(q));
        const matchesIsbn = book.isbn.toLowerCase().includes(q);
        return matchesTitle || matchesAuthor || matchesSub || matchesTag || matchesIsbn;
      }
      return true;
    });

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.publishedYear - a.publishedYear;
      if (sortBy === 'pages') return b.pages - a.pages;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      // featured default
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [books, selectedCategory, searchQuery, sortBy, durationFilter, eraFilter]);

  // Paginated books
  const totalPagesCount = Math.max(1, Math.ceil(filteredBooks.length / pageSize));

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBooks.slice(startIndex, startIndex + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  const favoriteBooks = useMemo(() => {
    return books.filter((book) => favoriteIds.includes(book.id));
  }, [books, favoriteIds]);

  const shelfBooks = useMemo(() => {
    const shelfIds = new Set([
      ...favoriteIds,
      ...Object.keys(readingProgress)
    ]);
    return books.filter((book) => shelfIds.has(book.id));
  }, [books, favoriteIds, readingProgress]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        favoriteIds,
        readingProgress,
        userNotes,
        searchQuery,
        selectedCategory,
        sortBy,
        viewMode,
        durationFilter,
        eraFilter,
        currentPage,
        pageSize,
        activeToast,
        toggleFavorite,
        isFavorite,
        setReadingStatus,
        getReadingStatus,
        saveUserNote,
        getUserNote,
        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        setViewMode,
        setDurationFilter,
        setEraFilter,
        setCurrentPage,
        setPageSize,
        addReview,
        dismissToast,
        showToast,
        addBook,
        importBooks,
        updateBook,
        deleteBook,
        batchDeleteBooks,
        resetCatalog,
        filteredBooks,
        paginatedBooks,
        totalPagesCount,
        favoriteBooks,
        shelfBooks,
        isApiSearching
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
