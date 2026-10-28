import React, { useState } from 'react';
import { Route } from '../hooks/useRouter';
import { useTheme } from '../context/ThemeContext';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Search, Bookmark, Menu, X, BookOpen, User, LogOut, Package, Globe } from 'lucide-react';

interface NavbarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch
}) => {
  const { theme, toggleTheme } = useTheme();
  const { favoriteIds } = useLibrary();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (name: Route['name']) => currentRoute.name === name;

  return (
    <header className="sticky top-0 z-40 glass border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand wordmark */}
          <button
            onClick={() => {
              onNavigate({ name: 'catalog' });
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 whitespace-nowrap shrink-0 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
              Athenaeum
            </span>
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-normal text-stone-600 dark:text-stone-300">
            <button
              onClick={() => onNavigate({ name: 'catalog' })}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 relative py-1 ${
                isCurrent('catalog')
                  ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900 dark:after:bg-stone-100'
                  : ''
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => onNavigate({ name: 'curations' })}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 relative py-1 ${
                isCurrent('curations')
                  ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900 dark:after:bg-stone-100'
                  : ''
              }`}
            >
              Curated Lists
            </button>
            <button
              onClick={() => onNavigate({ name: 'about' })}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 relative py-1 ${isCurrent('about') ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900 dark:after:bg-stone-100' : ''}`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate({ name: 'explore' })}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 relative py-1 ${isCurrent('explore') ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900 dark:after:bg-stone-100' : ''}`}
            >
              Explore
            </button>
            <button
              onClick={() => onNavigate({ name: 'journey' })}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 relative py-1 ${isCurrent('journey') ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900 dark:after:bg-stone-100' : ''}`}
            >
              Journey
            </button>
            <button
              onClick={() => onNavigate({ name: 'contact' })}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 relative py-1 ${isCurrent('contact') ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900 dark:after:bg-stone-100' : ''}`}
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate({ name: 'favorites' })}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 relative py-1 flex items-center gap-1.5 ${
                isCurrent('favorites')
                  ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900 dark:after:bg-stone-100'
                  : ''
              }`}
            >
              <span>My Bookshelf</span>
              {favoriteIds.length > 0 && (
                <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-stone-400">
                  ({favoriteIds.length})
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action + utility buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search Shortcut Trigger */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/70 dark:bg-stone-800/70 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200/80 dark:border-stone-700/80 rounded-md transition-colors"
              title="Search catalog (⌘K)"
              aria-label="Search catalog"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
              title="Search catalog"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
              aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Auth controls */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => onNavigate({ name: 'admin' })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      isCurrent('admin')
                        ? 'bg-amber-200 text-amber-950 dark:bg-amber-800 dark:text-amber-100 font-semibold ring-1 ring-amber-400'
                        : 'text-stone-900 dark:text-stone-100 bg-amber-100/70 dark:bg-amber-900/30 hover:bg-amber-200/80 dark:hover:bg-amber-900/50'
                    }`}
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={() => onNavigate({ name: 'account' })}
                  className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    isCurrent('account')
                      ? 'bg-stone-300 dark:bg-stone-700 text-stone-950 dark:text-white font-semibold ring-1 ring-stone-400 dark:ring-stone-500'
                      : 'text-stone-900 dark:text-stone-100 bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300/80 dark:hover:bg-stone-700'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[100px]">{user.name}</span>
                </button>
                <button
                  onClick={() => { logout(); onNavigate({ name: 'catalog' }); }}
                  className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate({ name: 'login' })}
                  className="px-3 py-1.5 text-xs font-medium text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate({ name: 'register' })}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* Primary Action Button: Explore or Bookshelf */}
            <button
              onClick={() => onNavigate({ name: 'favorites' })}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-200/80 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favorites</span>
              <span className="font-mono tabular-nums text-[11px] text-stone-600 dark:text-stone-400">
                {favoriteIds.length}
              </span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 py-4 space-y-3">
          <button
            onClick={() => {
              onNavigate({ name: 'catalog' });
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Catalog
          </button>
          <button
            onClick={() => {
              onNavigate({ name: 'curations' });
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Curated Lists
          </button>
          <button
            onClick={() => { onNavigate({ name: 'about' }); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            About
          </button>
          <button
            onClick={() => { onNavigate({ name: 'contact' }); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Contact
          </button>
          <button
            onClick={() => { onNavigate({ name: 'explore' }); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Explore
          </button>
          <button
            onClick={() => { onNavigate({ name: 'journey' }); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Journey
          </button>
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => { onNavigate({ name: 'admin' }); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={() => { onNavigate({ name: 'account' }); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
              >
                My Account & Orders
              </button>
              <button
                onClick={() => { logout(); onNavigate({ name: 'catalog' }); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
              >
                Sign Out ({user.name})
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { onNavigate({ name: 'login' }); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
              >
                Sign In
              </button>
              <button
                onClick={() => { onNavigate({ name: 'register' }); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100"
              >
                Register
              </button>
            </>
          )}
          <button
            onClick={() => {
              onNavigate({ name: 'favorites' });
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-900 dark:text-stone-100 flex items-center justify-between"
          >
            <span>My Bookshelf</span>
            <span className="font-mono tabular-nums text-xs text-stone-500">
              {favoriteIds.length} books
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
