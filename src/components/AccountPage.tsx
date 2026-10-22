import React from 'react';
import { Route } from '../hooks/useRouter';
import { useAuth } from '../context/AuthContext';
import { useOrders, OrderStatus } from '../context/OrderContext';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  Bookmark,
  User,
  ArrowRight,
  Shield,
  RotateCcw
} from 'lucide-react';

interface Props {
  onNavigate: (route: Route) => void;
}

const statusColor: Record<OrderStatus, string> = {
  Pending: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800',
  Processing: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800',
  Shipped: 'text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-800',
  Delivered: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-800',
  Cancelled: 'text-stone-600 bg-stone-100 dark:text-stone-400 dark:bg-stone-800 border border-stone-300 dark:border-stone-700'
};

export const AccountPage: React.FC<Props> = ({ onNavigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { userOrders, updateStatus } = useOrders();
  const { books, readingProgress, favoriteIds, showToast } = useLibrary();

  if (!user) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-16 animate-fadeIn">
        <div className="text-center max-w-sm mx-auto p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-500">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Reader Sign In
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Please sign in to view your preserved reading journal, active volume delivery orders, and personal bookshelf.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => onNavigate({ name: 'login' })}
              className="px-5 py-2.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate({ name: 'register' })}
              className="px-4 py-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Active currently-reading books
  const currentlyReadingEntries = Object.entries(readingProgress).filter(
    ([_, prog]) => prog.status === 'currently-reading'
  );
  const readingBooks = currentlyReadingEntries
    .map(([bookId, prog]) => {
      const book = books.find((b) => b.id === bookId);
      return book ? { book, prog } : null;
    })
    .filter(Boolean) as { book: typeof books[0]; prog: typeof readingProgress[string] }[];

  const handleCancelOrder = (orderId: string) => {
    updateStatus(orderId, 'Cancelled');
    showToast('Delivery order cancelled.');
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 animate-fadeIn space-y-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                {user.name}
              </h1>
              {isAdmin && (
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 font-semibold">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
              {user.email} · Reader Archive ID: {user.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onNavigate({ name: 'admin' })}
              className="px-3.5 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-200 rounded-md transition-colors cursor-pointer"
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={() => onNavigate({ name: 'favorites' })}
            className="px-3.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-md transition-colors cursor-pointer"
          >
            My Bookshelf ({favoriteIds.length})
          </button>
          <button
            onClick={() => {
              logout();
              onNavigate({ name: 'catalog' });
            }}
            className="px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Ongoing Reading Desk */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <span>Active Study Desk (Currently Reading)</span>
          </h2>
          <span className="text-xs text-stone-400 font-mono">
            {readingBooks.length} in progress
          </span>
        </div>

        {readingBooks.length === 0 ? (
          <div className="p-6 rounded-xl bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800/80 text-center space-y-2">
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              No volumes currently marked as in progress. Open any book excerpt in the reading room to resume study.
            </p>
            <button
              onClick={() => onNavigate({ name: 'catalog' })}
              className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Browse Catalog Monographs →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {readingBooks.map(({ book, prog }) => {
              const percent =
                prog.totalPages > 0
                  ? Math.min(100, Math.round((prog.currentPage / prog.totalPages) * 100))
                  : 0;

              return (
                <div
                  key={book.id}
                  className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 shadow-2xs flex gap-3.5 items-center hover:border-amber-400/60 dark:hover:border-amber-700/60 transition-colors"
                >
                  <div className="w-16 shrink-0">
                    <BookCover
                      coverImage={book.coverImage}
                      title={book.title}
                      author={book.author}
                      category={book.category}
                      className="w-full rounded-2xs shadow-xs"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {book.author}
                    </p>

                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                        <span>p. {prog.currentPage} of {book.pages}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-600 dark:bg-amber-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => onNavigate({ name: 'reader', bookId: book.id })}
                        className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Resume</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <span>Physical Volume Delivery Orders</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Tracking, packing status, and courier history for requested clothbound copies.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-stone-400">
            {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Truck className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-700" />
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No delivery orders on file.
            </p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Any monograph in the repository can be requested for physical delivery by opening its volume overview and clicking “Order for Delivery”.
            </p>
            <button
              onClick={() => onNavigate({ name: 'catalog' })}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userOrders.map((o) => (
              <div
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-stone-200/90 dark:border-stone-800/90 rounded-xl bg-stone-50/50 dark:bg-stone-950/30 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {o.bookTitle}
                    </h4>
                    <span className="text-xs font-mono text-stone-400">
                      ({o.quantity} {o.quantity === 1 ? 'copy' : 'copies'})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-mono">Order ID: {o.id}</span>
                    <span>·</span>
                    <span>Placed on {o.createdAt}</span>
                    <span>·</span>
                    <span className="truncate max-w-xs">Destination: {o.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[o.status]}`}
                  >
                    {o.status}
                  </span>

                  {o.status === 'Pending' && (
                    <button
                      onClick={() => handleCancelOrder(o.id)}
                      className="text-xs text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                      title="Cancel pending order"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};