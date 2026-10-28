import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { OrderProvider } from './context/OrderContext';
import { useAuth } from './context/AuthContext';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/Navbar';
import { HeroFeatured } from './components/HeroFeatured';
import { FilterBar } from './components/FilterBar';
import { BookGrid } from './components/BookGrid';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BackToTop } from './components/BackToTop';

// Route-level code splitting keeps the initial bundle lean for a premium first load.
const BookDetailPage = lazy(() => import('./components/BookDetailPage').then((m) => ({ default: m.BookDetailPage })));
const FavoritesPage = lazy(() => import('./components/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const CurationsPage = lazy(() => import('./components/CurationsPage').then((m) => ({ default: m.CurationsPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then((m) => ({ default: m.ContactPage })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const LoginPage = lazy(() => import('./components/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./components/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const AccountPage = lazy(() => import('./components/AccountPage').then((m) => ({ default: m.AccountPage })));
const ExplorePage = lazy(() => import('./components/ExplorePage').then((m) => ({ default: m.ExplorePage })));
const ReadingJourneyPage = lazy(() => import('./components/ReadingJourneyPage').then((m) => ({ default: m.ReadingJourneyPage })));
const ReaderModal = lazy(() => import('./components/ReaderModal').then((m) => ({ default: m.ReaderModal })));

function MainApp() {
  const { route, navigate, back } = useRouter();
  const {
    books,
    filteredBooks,
    setSearchQuery,
    setSelectedCategory,
    setSortBy
  } = useLibrary();
  const { user, isAdmin, login } = useAuth();

  // Dynamic document title per route
  useEffect(() => {
    const base = 'Athenaeum — Online Book Library';
    let title = base;
    if (route.name === 'book-detail') {
      const b = books.find((x) => x.id === route.bookId);
      title = b ? `${b.title} — Athenaeum` : base;
    } else if (route.name === 'reader') {
      const b = books.find((x) => x.id === route.bookId);
      title = b ? `Reading: ${b.title} — Athenaeum` : base;
    } else if (route.name === 'favorites') {
      title = 'My Bookshelf — Athenaeum';
    } else if (route.name === 'curations') {
      title = 'Curated Pathways — Athenaeum';
    } else if (route.name === 'about') {
      title = 'About — Athenaeum';
    } else if (route.name === 'contact') {
      title = 'Contact — Athenaeum';
    } else if (route.name === 'admin') {
      title = 'Admin — Athenaeum';
    } else if (route.name === 'explore') {
      title = 'Explore — Athenaeum';
    } else if (route.name === 'journey') {
      title = 'Reading Journey — Athenaeum';
    } else {
      title = 'Catalog — Athenaeum';
    }
    document.title = title;
  }, [route, books]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Default featured book for hero section
  const featuredBook =
    books.find((b) => b.featured) || books[0];

  const handleSelectBook = (bookId: string) => {
    navigate({ name: 'book-detail', bookId });
  };

  const handleStartReading = (bookId: string) => {
    navigate({ name: 'reader', bookId });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleOpenSearch = () => {
    setIsCommandPaletteOpen(true);
  };

  // Keyboard shortcut: Cmd/Ctrl+K opens command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const routeKey =
    route.name === 'book-detail' || route.name === 'reader'
      ? `${route.name}-${route.bookId}`
      : route.name;

  // Immersive Full-Screen Admin Dashboard Shell
  if (route.name === 'admin') {
    if (isAdmin) {
      return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">Loading console…</div>}>
          <div className="min-h-screen flex flex-col font-sans text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-[#0c0d10] transition-colors">
            <AdminDashboard
              onExit={() => navigate({ name: 'catalog' })}
              onSelectBook={(bookId) => navigate({ name: 'book-detail', bookId })}
            />
            <Toast />
          </div>
        </Suspense>
      );
    }
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">Loading…</div>}>
    <div className="min-h-screen flex flex-col font-sans text-stone-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-950 transition-colors">
      {/* Top Navbar Contract */}
      <Navbar
        currentRoute={route}
        onNavigate={navigate}
        onOpenSearch={handleOpenSearch}
      />

      {/* Main Content Area Routed by Route State */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
        {route.name === 'catalog' && (
          <div className="space-y-12 pb-16">
            {/* Featured Book Hero Spotlight */}
            {featuredBook && (
            <HeroFeatured
              book={featuredBook}
              onSelectBook={handleSelectBook}
              onStartReading={handleStartReading}
            />
            )}

            {/* Catalog Browser Section */}
            <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 dark:border-stone-800/80 pb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                    The Library Catalog
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic mt-0.5">
                    Live archival catalog connected with online book repositories and publisher databases.
                  </p>
                </div>
              </div>

              {/* Filter Bar */}
              <FilterBar totalResults={filteredBooks.length} />

              {/* Book Grid */}
              <BookGrid
                books={filteredBooks}
                onSelectBook={handleSelectBook}
                onStartReading={handleStartReading}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        )}

        {route.name === 'book-detail' && (
          (() => {
            const currentBook = books.find((b) => b.id === route.bookId);
            if (!currentBook) {
              return (
                <div className="max-w-md mx-auto py-24 text-center space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Volume not found</h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400">The requested monograph is no longer in the catalog.</p>
                  <button onClick={() => navigate({ name: 'catalog' })} className="px-4 py-2 text-sm font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-md">Return to Catalog</button>
                </div>
              );
            }
            return (
              <BookDetailPage
                book={currentBook}
                onBack={back}
                onStartReading={handleStartReading}
                onSelectRelatedBook={handleSelectBook}
              />
            );
          })()
        )}

        {route.name === 'favorites' && (
          <FavoritesPage
            onSelectBook={handleSelectBook}
            onStartReading={handleStartReading}
            onExploreCatalog={() => navigate({ name: 'catalog' })}
          />
        )}

        {route.name === 'curations' && (
          <CurationsPage
            onSelectBook={handleSelectBook}
            onStartReading={handleStartReading}
          />
        )}

        {route.name === 'about' && <AboutPage onNavigate={navigate} />}

        {route.name === 'contact' && <ContactPage />}

        {route.name === 'explore' && (
          <ExplorePage
            onNavigate={navigate}
            onSelectBook={handleSelectBook}
            onStartReading={handleStartReading}
          />
        )}

        {route.name === 'journey' && (
          <ReadingJourneyPage
            onNavigate={navigate}
            onSelectBook={handleSelectBook}
            onStartReading={handleStartReading}
          />
        )}

        {route.name === 'login' && <LoginPage onNavigate={navigate} />}

        {route.name === 'register' && <RegisterPage onNavigate={navigate} />}

        {route.name === 'account' && <AccountPage onNavigate={navigate} />}

        {route.name === 'admin' && (
          <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-serif text-2xl font-bold border border-amber-500/20">
              A
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                Curator Console Access
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
                This area is reserved for library administrators and collection curators.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  login('admin@athenaeum.library', 'admin123');
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-colors shadow-2xs cursor-pointer"
              >
                Sign In as Curator (Demo 1-Click)
              </button>
              <button
                onClick={() => navigate({ name: 'login' })}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors cursor-pointer"
              >
                Standard Login Form
              </button>
            </div>
          </div>
        )}

        {route.name === 'reader' && (
          (() => {
            const bookToRead = books.find((b) => b.id === route.bookId);
            if (!bookToRead) {
              return (
                <div className="max-w-md mx-auto py-24 text-center space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Nothing to read</h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400">This volume is no longer available.</p>
                  <button onClick={() => navigate({ name: 'catalog' })} className="px-4 py-2 text-sm font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-md">Return to Catalog</button>
                </div>
              );
            }
            return (
              <ReaderModal
                book={bookToRead}
                onClose={back}
                onSelectBook={(newBookId) => navigate({ name: 'reader', bookId: newBookId })}
              />
            );
          })()
        )}
      </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Toast Feedback Notification */}
      <Toast />

      {/* Spotlight Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
        onSelectBook={handleSelectBook}
        onStartReading={handleStartReading}
      />

      {/* Back to top */}
      <BackToTop />

      {/* Minimalist Anti-Slop Footer */}
      <Footer onNavigate={navigate} />
    </div>
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LibraryProvider>
          <OrderProvider>
            <ErrorBoundary>
              <MainApp />
            </ErrorBoundary>
          </OrderProvider>
        </LibraryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
