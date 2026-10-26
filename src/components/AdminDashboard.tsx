import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  Download,
  Upload,
  RotateCcw,
  Globe,
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Settings,
  Star,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Truck,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  LogOut,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Book, BookCategory } from '../types/book';
import { useOrders, OrderStatus } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { BookCover } from './BookCover';
import { searchBooksApi, CURATED_IMPORTABLE_SELECTIONS } from '../services/booksApi';

interface AdminDashboardProps {
  onExit?: () => void;
  onSelectBook?: (bookId: string) => void;
}

const emptyBook: Omit<Book, 'id'> = {
  title: '',
  author: '',
  subtitle: '',
  authorBio: '',
  coverImage: '',
  category: 'Philosophy',
  rating: 4.8,
  ratingCount: 12,
  pages: 280,
  publishedYear: 2024,
  publisher: 'Athenaeum Folio Society',
  isbn: '',
  language: 'EN',
  readTimeHours: 6,
  summary: '',
  quote: '',
  quoteAttribution: '',
  tableOfContents: ['I. Prolegomena', 'II. Core Inquiries', 'III. Structural Dialectic', 'IV. Conclusions'],
  sampleExcerpt: {
    chapterTitle: 'Chapter I: Foundations',
    subtitle: 'On the discipline of slow contemplation',
    paragraphs: [
      'In the architecture of deliberate inquiry, clarity is not merely an ornament, but the bedrock upon which genuine understanding rests.'
    ]
  },
  tags: ['Archival', 'Folio'],
  featured: false,
  edition: 'First Folio Edition',
  reviews: []
};

type AdminTab = 'overview' | 'catalog' | 'importer' | 'orders' | 'users' | 'analytics' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit, onSelectBook }) => {
  const {
    books,
    addBook,
    importBooks,
    updateBook,
    deleteBook,
    batchDeleteBooks,
    resetCatalog,
    showToast
  } = useLibrary();
  const { allOrders, updateStatus, deleteOrder } = useOrders();
  const { users, updateUserRole, deleteUser, user, logout } = useAuth();

  // Navigation state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Catalog tab states
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<BookCategory>('All');
  const [catalogSort, setCatalogSort] = useState<'title' | 'author' | 'year' | 'rating' | 'pages'>('title');
  const [catalogPage, setCatalogPage] = useState(1);
  const catalogPageSize = 15;
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);
  const [bookForm, setBookForm] = useState<Omit<Book, 'id'>>(emptyBook);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'general' | 'metadata' | 'excerpt'>('general');

  // Live API Importer states
  const [apiQuery, setApiQuery] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResults, setApiResults] = useState<Book[]>([]);
  const [importedApiIds, setImportedApiIds] = useState<Set<string>>(new Set());
  const [apiProvider, setApiProvider] = useState<'google' | 'openlibrary'>('google');

  // Orders tab states
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'All'>('All');

  // Users tab states
  const [userQuery, setUserQuery] = useState('');
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);

  // Settings tab states
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Derived filtered catalog
  const filteredCatalog = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    return books
      .filter((b) => {
        if (catalogCategory !== 'All' && b.category !== catalogCategory) return false;
        if (!q) return true;
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (catalogSort === 'title') return a.title.localeCompare(b.title);
        if (catalogSort === 'author') return a.author.localeCompare(b.author);
        if (catalogSort === 'year') return b.publishedYear - a.publishedYear;
        if (catalogSort === 'rating') return b.rating - a.rating;
        if (catalogSort === 'pages') return b.pages - a.pages;
        return 0;
      });
  }, [books, catalogQuery, catalogCategory, catalogSort]);

  const totalCatalogPages = Math.ceil(filteredCatalog.length / catalogPageSize) || 1;
  const paginatedCatalog = useMemo(() => {
    const start = (catalogPage - 1) * catalogPageSize;
    return filteredCatalog.slice(start, start + catalogPageSize);
  }, [filteredCatalog, catalogPage]);

  // Reset page when search or category changes
  useEffect(() => {
    setCatalogPage(1);
  }, [catalogQuery, catalogCategory, catalogSort]);

  // Derived filtered orders
  const filteredOrders = useMemo(() => {
    const q = orderQuery.trim().toLowerCase();
    return allOrders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.userName.toLowerCase().includes(q) ||
        o.bookTitle.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
      );
    });
  }, [allOrders, orderQuery, orderStatusFilter]);

  // Derived filtered users
  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, userQuery]);

  // Category distribution calculation
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    books.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).map(([cat, count]) => ({
      name: cat,
      count,
      pct: Math.round((count / books.length) * 100)
    }));
  }, [books]);

  // API Search runner
  const handleApiSearch = async (queryText?: string) => {
    const term = queryText ?? apiQuery;
    if (!term.trim()) return;
    setApiLoading(true);
    try {
      const results = await searchBooksApi(term, 16);
      setApiResults(results);
      if (results.length === 0) {
        showToast('No books found for this query via API.');
      }
    } catch {
      showToast('Error searching online book services.');
    } finally {
      setApiLoading(false);
    }
  };

  // 1-Click Import single book
  const handleImportSingle = (book: Book) => {
    addBook(book);
    setImportedApiIds((prev) => new Set(prev).add(book.id));
  };

  // Batch import all search results
  const handleImportAllResults = () => {
    if (apiResults.length === 0) return;
    const added = importBooks(apiResults);
    apiResults.forEach((b) => setImportedApiIds((prev) => new Set(prev).add(b.id)));
    showToast(`Successfully imported ${added} new volumes into Athenaeum.`);
  };

  // Open Add/Edit Book modal
  const openNewBook = () => {
    setBookForm(emptyBook);
    setEditingBook(null);
    setIsCreatingBook(true);
    setModalTab('general');
  };

  const openEditBook = (book: Book) => {
    const { id: _id, ...rest } = book;
    setBookForm(rest);
    setEditingBook(book);
    setIsCreatingBook(false);
    setModalTab('general');
  };

  const closeBookModal = () => {
    setEditingBook(null);
    setIsCreatingBook(false);
  };

  const saveBook = () => {
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      showToast('Title and Author are required.');
      return;
    }
    if (editingBook) {
      updateBook(editingBook.id, bookForm);
    } else {
      const slugId =
        bookForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
        '-' +
        crypto.randomUUID();
      addBook({ id: slugId, ...bookForm });
    }
    closeBookModal();
  };

  // Batch Selection Helpers
  const toggleSelectBook = (id: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllPage = () => {
    const pageIds = paginatedCatalog.map((b) => b.id);
    const allSelected = pageIds.every((id) => selectedBookIds.includes(id));
    if (allSelected) {
      setSelectedBookIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedBookIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleBatchDelete = () => {
    if (selectedBookIds.length === 0) return;
    batchDeleteBooks(selectedBookIds);
    setSelectedBookIds([]);
  };

  // Export Catalog as JSON
  const handleExportCatalog = () => {
    const jsonStr = JSON.stringify(books, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athenaeum-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalog exported as JSON.');
  };

  // Import Catalog from JSON file
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const added = importBooks(parsed);
          showToast(`Catalog imported: ${added} volumes added.`);
        } else {
          showToast('Invalid JSON file format.');
        }
      } catch {
        showToast('Error reading catalog file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export Orders as CSV
  const handleExportOrders = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export.');
      return;
    }
    const headers = ['Order ID', 'Customer', 'Book', 'Quantity', 'Status', 'Address', 'Created At'];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.userName,
      o.bookTitle,
      o.quantity,
      o.status,
      o.address,
      o.createdAt
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athenaeum-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Orders exported as CSV.');
  };

  // Export Users as CSV
  const handleExportUsers = () => {
    if (filteredUsers.length === 0) {
      showToast('No users to export.');
      return;
    }
    const headers = ['User ID', 'Name', 'Email', 'Role'];
    const rows = filteredUsers.map((u) => [u.id, u.name, u.email, u.role]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athenaeum-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Users exported as CSV.');
  };

  const pendingOrdersCount = allOrders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#0c0d10] text-stone-900 dark:text-stone-100 flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#121318]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900"
            aria-label="Toggle menu"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-lg border border-amber-600/30">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  Athenaeum Console
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono hidden md:block">
                Curator Control Panel · {books.length} Volumes Indexed
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={openNewBook}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Volume</span>
          </button>

          <button
            onClick={() => setActiveTab('importer')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Online API Importer</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              title="Return to Public Library Catalog"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Exit to Library</span>
            </button>
          )}

          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
            <div className="w-7 h-7 rounded-full bg-stone-800 text-amber-300 dark:bg-stone-200 dark:text-stone-900 flex items-center justify-center font-bold text-xs">
              {user?.name?.slice(0, 1) || 'C'}
            </div>
            <span className="font-medium hidden lg:inline">{user?.name || 'Curator'}</span>
          </div>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Dynamic Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#121318] border-r border-stone-200/80 dark:border-stone-800/80 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Sidebar close button on mobile */}
            <div className="flex items-center justify-between md:hidden pb-2 border-b border-stone-200 dark:border-stone-800">
              <span className="font-serif font-bold text-sm">Navigation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Group 1: Core Operations */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
                Core Console
              </span>

              <button
                onClick={() => {
                  setActiveTab('overview');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Overview</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('catalog');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4" />
                  <span>Catalog Inventory</span>
                </div>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    activeTab === 'catalog'
                      ? 'bg-white/20 text-white dark:bg-stone-900/30 dark:text-stone-900'
                      : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {books.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('importer');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'importer'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-sky-500" />
                  <span>Live API Importer</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                  API
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4" />
                  <span>Orders & Courier</span>
                </div>
                {pendingOrdersCount > 0 && (
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white dark:text-stone-950">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Nav Group 2: Management & Readers */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
                Access & Intelligence
              </span>

              <button
                onClick={() => {
                  setActiveTab('users');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Readers & Users</span>
                </div>
                <span className="text-xs font-mono text-stone-400">{users.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & Insights</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Backup & Settings</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-stone-200/80 dark:border-stone-800/80 space-y-3">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 text-xs">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 font-mono text-[10px]">
                <span>ARCHIVAL ENGINE</span>
                <span className="text-emerald-500 font-bold">ACTIVE</span>
              </div>
              <p className="mt-1 font-semibold text-stone-800 dark:text-stone-200 truncate">
                {books.length} Works · 7 Disciplines
              </p>
            </div>

            <button
              onClick={() => {
                logout();
                if (onExit) onExit();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out Curator</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Dynamic Center Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ============================================================== */}
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                    Curator Dashboard Overview
                  </h1>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Real-time archival metrics, collection growth, orders circulation, and reader activity.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openNewBook}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 text-sm font-medium transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" /> New Book
                  </button>
                  <button
                    onClick={() => setActiveTab('importer')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium transition-colors"
                  >
                    <Globe className="w-4 h-4 text-sky-500" /> Import via API
                  </button>
                </div>
              </div>

              {/* 4 Hero KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                {/* Total Books */}
                <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Total Volumes
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
                      {books.length}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                      +100% real covers
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Across 7 disciplines in archival folio</p>
                </div>

                {/* Orders & Deliveries */}
                <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Total Orders
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
                      {allOrders.length}
                    </span>
                    {pendingOrdersCount > 0 && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium font-mono">
                        {pendingOrdersCount} pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Courier tracked delivery workflow</p>
                </div>

                {/* Registered Readers */}
                <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Registered Readers
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
                      {users.length}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Academic scholars and readers</p>
                </div>

                {/* Average Rating */}
                <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Catalog Rating
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
                      4.8
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/ 5.0</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Curated high standard monographs</p>
                </div>
              </div>

              {/* Charts & Visual Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual Circulation Chart */}
                <div className="lg:col-span-7 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                        Monthly Circulation & Lending
                      </h2>
                      <p className="text-xs text-stone-500">Folio dispatches and digital reads across recent months</p>
                    </div>
                    <span className="text-xs font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">
                      2024-2025
                    </span>
                  </div>

                  {/* SVG Bar Chart Visualization */}
                  <div className="pt-4">
                    <div className="h-44 flex items-end justify-between gap-3 sm:gap-5 px-2">
                      {[
                        { month: 'Sep', val: 42, label: '42 books' },
                        { month: 'Oct', val: 68, label: '68 books' },
                        { month: 'Nov', val: 94, label: '94 books' },
                        { month: 'Dec', val: 128, label: '128 books' },
                        { month: 'Jan', val: 162, label: '162 books' },
                        { month: 'Feb', val: 198, label: '198 books (Current)' }
                      ].map((item, idx) => (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="relative w-full flex justify-center">
                            {/* Hover tooltip */}
                            <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-[10px] font-mono py-0.5 px-2 rounded whitespace-nowrap shadow-md pointer-events-none z-10">
                              {item.label}
                            </span>
                            {/* Bar */}
                            <div
                              style={{ height: `${(item.val / 200) * 100}%` }}
                              className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 group-hover:brightness-110 ${
                                idx === 5
                                  ? 'bg-gradient-to-t from-amber-600 to-amber-500'
                                  : 'bg-stone-300 dark:bg-stone-700'
                              }`}
                            />
                          </div>
                          <span className="text-xs font-mono text-stone-500">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="lg:col-span-5 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                      Catalog by Discipline
                    </h2>
                    <span className="text-xs font-mono text-stone-400">{books.length} Total</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {categoryStats.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-700 dark:text-stone-300 font-medium">
                            {item.name}
                          </span>
                          <span className="font-mono text-stone-500">
                            {item.count} ({item.pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${item.pct}%` }}
                            className="h-full bg-amber-600 dark:bg-amber-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Orders & Quick Shortcuts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders Table */}
                <div className="lg:col-span-8 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                      Recent Delivery Dispatches
                    </h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      View All Orders <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-[11px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-200/80 dark:border-stone-800/80 pb-2">
                        <tr>
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Book Title</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                        {allOrders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30">
                            <td className="py-3 font-mono text-xs text-stone-500">{ord.id}</td>
                            <td className="py-3 font-medium text-stone-900 dark:text-stone-100">
                              {ord.userName}
                            </td>
                            <td className="py-3 text-stone-600 dark:text-stone-300 max-w-[200px] truncate">
                              {ord.bookTitle}
                            </td>
                            <td className="py-3">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                    : ord.status === 'Shipped'
                                    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                    : ord.status === 'Processing'
                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    : 'bg-stone-500/10 text-stone-700 dark:text-stone-300'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setActiveTab('orders')}
                                className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-medium"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Curatorial Actions */}
                <div className="lg:col-span-4 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-4">
                  <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    Curator Shortcuts
                  </h2>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('importer')}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <div>
                          <p className="text-sm font-semibold">Live Google Books Import</p>
                          <p className="text-xs text-stone-500">Query and add any book in seconds</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={openNewBook}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <p className="text-sm font-semibold">Add Custom Volume</p>
                          <p className="text-xs text-stone-500">Full folio authoring with excerpts</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={handleExportCatalog}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="text-sm font-semibold">Backup Catalog JSON</p>
                          <p className="text-xs text-stone-500">Export complete 200+ book dataset</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CATALOG MANAGEMENT */}
          {/* ============================================================== */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                    Catalog Inventory ({filteredCatalog.length})
                  </h1>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Manage archival monographs, edit bibliographical details, toggle hero spotlights, and batch export.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openNewBook}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" /> Add Volume
                  </button>
                  <button
                    onClick={() => setActiveTab('importer')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-medium transition-colors"
                  >
                    <Globe className="w-4 h-4 text-sky-500" /> Live Search API
                  </button>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white dark:bg-[#15161c] p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search box */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={catalogQuery}
                      onChange={(e) => setCatalogQuery(e.target.value)}
                      placeholder="Search catalog by title, author, category, or ISBN…"
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    {catalogQuery && (
                      <button
                        onClick={() => setCatalogQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <select
                    value={catalogCategory}
                    onChange={(e) => setCatalogCategory(e.target.value as BookCategory)}
                    className="px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm"
                  >
                    <option value="All">All Disciplines</option>
                    {[
                      'Architecture & Design',
                      'Philosophy',
                      'Science & Technology',
                      'Literary Fiction',
                      'Essays & Art',
                      'History & Civilization',
                      'Psychology & Mind'
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={catalogSort}
                    onChange={(e) => setCatalogSort(e.target.value as any)}
                    className="px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-mono text-xs"
                  >
                    <option value="title">Sort: Title (A-Z)</option>
                    <option value="author">Sort: Author (A-Z)</option>
                    <option value="year">Sort: Year (Newest)</option>
                    <option value="rating">Sort: Rating (Highest)</option>
                    <option value="pages">Sort: Length (Pages)</option>
                  </select>
                </div>

                {/* Batch Action Toolbar when items selected */}
                {selectedBookIds.length > 0 && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="font-medium text-amber-900 dark:text-amber-300">
                      {selectedBookIds.length} volumes selected
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBatchDelete}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                      </button>
                      <button
                        onClick={() => setSelectedBookIds([])}
                        className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                      >
                        Deselect
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Catalog Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#15161c] shadow-2xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50/80 dark:bg-stone-800/40 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-200/80 dark:border-stone-800/80">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            paginatedCatalog.length > 0 &&
                            paginatedCatalog.every((b) => selectedBookIds.includes(b.id))
                          }
                          onChange={toggleSelectAllPage}
                          className="rounded border-stone-300 dark:border-stone-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-2 w-14">Cover</th>
                      <th className="py-3 px-4">Title & Author</th>
                      <th className="py-3 px-4">Discipline</th>
                      <th className="py-3 px-3">Year</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-3 text-center">Spotlight</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                    {paginatedCatalog.map((book) => {
                      const isSelected = selectedBookIds.includes(book.id);
                      return (
                        <tr
                          key={book.id}
                          className={`hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition-colors ${
                            isSelected ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectBook(book.id)}
                              className="rounded border-stone-300 dark:border-stone-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <div className="w-10 h-14 rounded overflow-hidden shadow-2xs shrink-0">
                              <BookCover
                                coverImage={book.coverImage}
                                title={book.title}
                                author={book.author}
                                category={book.category}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="max-w-[280px] sm:max-w-xs">
                              <p className="font-serif font-bold text-stone-900 dark:text-stone-100 truncate hover:text-amber-700 dark:hover:text-amber-400">
                                {book.title}
                              </p>
                              <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                                {book.author}
                              </p>
                              {book.isbn && (
                                <span className="font-mono text-[10px] text-stone-400">
                                  ISBN: {book.isbn}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 whitespace-nowrap">
                              {book.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-stone-500">
                            {book.publishedYear}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1 font-mono text-xs">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>{book.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => updateBook(book.id, { featured: !book.featured })}
                              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                book.featured
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                                  : 'text-stone-300 dark:text-stone-600 hover:text-stone-500'
                              }`}
                              title={book.featured ? 'Featured on home hero spotlight' : 'Click to feature on home hero'}
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {onSelectBook && (
                                <button
                                  onClick={() => onSelectBook(book.id)}
                                  className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                                  title="View Public Page"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => openEditBook(book)}
                                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                                title="Edit Volume"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(book.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-stone-400 hover:text-red-600 dark:hover:text-red-400"
                                title="Delete Volume"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredCatalog.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <p className="text-sm text-stone-500">No books found matching criteria.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalCatalogPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-xs font-mono text-stone-500">
                    Showing {(catalogPage - 1) * catalogPageSize + 1} to{' '}
                    {Math.min(catalogPage * catalogPageSize, filteredCatalog.length)} of{' '}
                    {filteredCatalog.length} volumes
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                      disabled={catalogPage === 1}
                      className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-xs font-mono font-medium">
                      Page {catalogPage} of {totalCatalogPages}
                    </span>
                    <button
                      onClick={() => setCatalogPage((p) => Math.min(totalCatalogPages, p + 1))}
                      disabled={catalogPage === totalCatalogPages}
                      className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: LIVE ONLINE API IMPORTER (Google Books & OpenLibrary) */}
          {/* ============================================================== */}
          {activeTab === 'importer' && (
            <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
              {/* Header */}
              <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      <Globe className="w-4 h-4" />
                      <span>Live External API Integration</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
                      Online Books Importer
                    </h1>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      Query Google Books and OpenLibrary API in real-time. Preview high-res covers, excerpts, and import into Athenaeum with 1 click.
                    </p>
                  </div>

                  {apiResults.length > 0 && (
                    <button
                      onClick={handleImportAllResults}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-2xs"
                    >
                      <Check className="w-4 h-4" /> Import All {apiResults.length} Results
                    </button>
                  )}
                </div>

                {/* API Search Form */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={apiQuery}
                      onChange={(e) => setApiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApiSearch()}
                      placeholder="Search any title, author, or keyword (e.g. Sapiens, Deep Work, Marcus Aurelius, Dune)…"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                    />
                  </div>
                  <button
                    onClick={() => handleApiSearch()}
                    disabled={apiLoading || !apiQuery.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium text-sm transition-colors cursor-pointer shadow-2xs"
                  >
                    {apiLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Searching API…</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Search Live Books</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Curated 1-Click Search Suggestions */}
                <div className="pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-2">
                    Curated Archival Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CURATED_IMPORTABLE_SELECTIONS.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setApiQuery(item.query);
                          handleApiSearch(item.query);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs text-stone-700 dark:text-stone-300 transition-colors"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* API Search Results Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    Live Results {apiResults.length > 0 && `(${apiResults.length} volumes)`}
                  </h2>
                </div>

                {apiResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {apiResults.map((item) => {
                      const alreadyInCatalog = books.some(
                        (b) => b.id === item.id || (item.isbn && b.isbn === item.isbn)
                      );
                      const isImported = importedApiIds.has(item.id) || alreadyInCatalog;

                      return (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-[#15161c] p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex gap-4">
                              <div className="w-20 h-28 shrink-0 rounded overflow-hidden shadow-md">
                                <BookCover
                                  coverImage={item.coverImage}
                                  title={item.title}
                                  author={item.author}
                                  category={item.category}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                                  {item.category}
                                </span>
                                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                                  {item.author}
                                </p>
                                <div className="text-[11px] font-mono text-stone-400 pt-1">
                                  {item.publishedYear} · {item.pages} pp
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                              {item.summary}
                            </p>
                          </div>

                          <button
                            onClick={() => handleImportSingle(item)}
                            disabled={isImported}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              isImported
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900'
                            }`}
                          >
                            {isImported ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>In Athenaeum Catalog</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Import to Catalog</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#15161c] p-12 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 text-center space-y-3">
                    <Globe className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-stone-700 dark:text-stone-300">
                      Query Global Book Metadata
                    </h3>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      Search above to retrieve real authentic volumes from Google Books and OpenLibrary API with verified ISBNs, high-resolution jackets, and publisher summaries.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: ORDERS & COURIER TRACKING */}
          {/* ============================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                    Orders & Courier Logistics ({allOrders.length})
                  </h1>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Manage reader physical folio dispatches, update delivery statuses, and track addresses.
                  </p>
                </div>
                <button
                  onClick={handleExportOrders}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 text-sm font-medium transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
              <div className="bg-white dark:bg-[#15161c] p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="Search orders by customer, order ID, book, or address…"
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl">
                    {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as Array<
                      OrderStatus | 'All'
                    >).map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          orderStatusFilter === status
                            ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-2xs font-semibold'
                            : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#15161c] shadow-2xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50/80 dark:bg-stone-800/40 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-200/80 dark:border-stone-800/80">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer & Shipping Address</th>
                      <th className="py-3 px-4">Ordered Monograph</th>
                      <th className="py-3 px-3">Quantity</th>
                      <th className="py-3 px-4">Status Workflow</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30">
                        <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-600 dark:text-stone-300">
                          {ord.id}
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-stone-900 dark:text-stone-100">
                              {ord.userName}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 max-w-xs truncate">
                              {ord.address}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-serif font-medium text-stone-900 dark:text-stone-100 max-w-xs truncate">
                          {ord.bookTitle}
                        </td>
                        <td className="py-4 px-3 font-mono text-xs text-stone-600 dark:text-stone-300">
                          {ord.quantity}x Folio
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateStatus(ord.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                : ord.status === 'Shipped'
                                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30'
                                : ord.status === 'Processing'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                                : ord.status === 'Cancelled'
                                ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                                : 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/30'
                            }`}
                          >
                            {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="py-4 px-4 text-xs font-mono text-stone-400">
                          {ord.createdAt}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              deleteOrder(ord.id);
                              showToast('Order record removed.');
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <p className="text-sm text-stone-500">No orders match the selected filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: READERS & USERS */}
          {/* ============================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                    Readers & User Accounts ({users.length})
                  </h1>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Manage library membership roles, promote scholars to admin curators, and inspect accounts.
                  </p>
                </div>
                <button
                  onClick={handleExportUsers}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 text-sm font-medium transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>

              {/* Filter */}
              <div className="bg-white dark:bg-[#15161c] p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Search readers by name or email…"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#15161c] shadow-2xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50/80 dark:bg-stone-800/40 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-200/80 dark:border-stone-800/80">
                    <tr>
                      <th className="py-3 px-4">Member Profile</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">System Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-600/10 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-600/20">
                              {u.name.slice(0, 1)}
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900 dark:text-stone-100">
                                {u.name}
                              </p>
                              <span className="font-mono text-[10px] text-stone-400">{u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-stone-600 dark:text-stone-300 font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateUserRole(u.id, e.target.value as 'admin' | 'user')
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              u.role === 'admin'
                                ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                            }`}
                          >
                            <option value="user">Reader (Standard)</option>
                            <option value="admin">Curator (Admin)</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                            if (u.id === user?.id) {
                              showToast('You cannot delete your own admin account.');
                              return;
                            }
                            setConfirmDeleteUserId(u.id);
                          }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: ANALYTICS & INSIGHTS */}
          {/* ============================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
              <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  Archival Intelligence & Readership Metrics
                </h1>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  Collection health, reading depth, and thematic coverage distribution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Average Book Length
                  </span>
                  <p className="font-serif text-3xl font-bold mt-2">
                    {Math.round(books.reduce((s, b) => s + b.pages, 0) / books.length)} pp
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Estimated 7.2 hours average read time</p>
                </div>

                <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Featured Highlights
                  </span>
                  <p className="font-serif text-3xl font-bold mt-2">
                    {books.filter((b) => b.featured).length} Volumes
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Highlighted in public hero showcase</p>
                </div>

                <div className="bg-white dark:bg-[#15161c] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Reader Reflections
                  </span>
                  <p className="font-serif text-3xl font-bold mt-2">
                    {books.reduce((s, b) => s + (b.reviews?.length || 0), 0)} Reviews
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Published by verified scholars</p>
                </div>
              </div>

              {/* Comprehensive Category Table */}
              <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Discipline Coverage Breakdown
                </h2>
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {categoryStats.map((item) => (
                    <div key={item.name} className="py-3 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-stone-900 dark:text-stone-100">{item.name}</p>
                        <p className="text-xs text-stone-500">
                          {item.count} monographs ({item.pct}% of library)
                        </p>
                      </div>
                      <div className="w-48 bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.pct}%` }}
                          className="h-full bg-amber-600 dark:bg-amber-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: BACKUPS & SYSTEM SETTINGS */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  Backup, Data Import & Storage Settings
                </h1>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  Export, import, or restore the Athenaeum library catalog to guarantee zero data loss.
                </p>
              </div>

              <div className="space-y-4">
                {/* Export Card */}
                <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      Export Catalog JSON
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Download the full catalog ({books.length} volumes with complete metadata, quotes, excerpts, and ISBNs) as a JSON file.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCatalog}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 text-sm font-medium transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" /> Export JSON
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      Import Catalog JSON
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload an existing catalog JSON backup to append or merge new volumes into the collection.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-colors cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload JSON</span>
                    <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                  </label>
                </div>

                {/* Reset to Archival Defaults */}
                <div className="bg-white dark:bg-[#15161c] p-6 rounded-2xl border border-red-200/60 dark:border-red-950/40 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-red-600 dark:text-red-400">
                      Restore Default Archival Collection
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Resets local catalog storage back to the original 200 curated volumes with assigned ISBN covers.
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmResetOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Catalog
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT BOOK */}
      {/* ============================================================== */}
      {(editingBook || isCreatingBook) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm"
          onClick={closeBookModal}
        >
          <div
            className="w-full max-w-3xl bg-white dark:bg-[#15161c] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                    {editingBook ? `Edit: ${editingBook.title}` : 'Add New Archival Volume'}
                  </h2>
                  <p className="text-xs text-stone-500">Configure catalog metadata, cover jacket, and reader excerpt</p>
                </div>
              </div>
              <button
                onClick={closeBookModal}
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-stone-200/80 dark:border-stone-800/80 pb-2">
              <button
                onClick={() => setModalTab('general')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  modalTab === 'general'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                1. Title & Details
              </button>
              <button
                onClick={() => setModalTab('metadata')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  modalTab === 'metadata'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                2. Synopsis & Bio
              </button>
              <button
                onClick={() => setModalTab('excerpt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  modalTab === 'excerpt'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                3. Reader Excerpt Chapter
              </button>
            </div>

            {/* Tab 1: General Info */}
            {modalTab === 'general' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    placeholder="e.g. The Architecture of the City"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="e.g. Aldo Rossi"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Discipline Category
                  </label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm"
                  >
                    {[
                      'Architecture & Design',
                      'Philosophy',
                      'Science & Technology',
                      'Literary Fiction',
                      'Essays & Art',
                      'History & Civilization',
                      'Psychology & Mind'
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Subtitle / Edition Note
                  </label>
                  <input
                    type="text"
                    value={bookForm.subtitle}
                    onChange={(e) => setBookForm({ ...bookForm, subtitle: e.target.value })}
                    placeholder="e.g. Oppositions Books Series"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    ISBN (Used for automatic real jacket retrieval)
                  </label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={(e) => {
                      const newIsbn = e.target.value;
                      const autoCover = newIsbn.length >= 10 ? `https://covers.openlibrary.org/b/isbn/${newIsbn}-M.jpg` : bookForm.coverImage;
                      setBookForm({ ...bookForm, isbn: newIsbn, coverImage: autoCover });
                    }}
                    placeholder="e.g. 9780262680424"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={bookForm.coverImage}
                    onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                    placeholder="https://... or /images/... or OpenLibrary ISBN link"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Published Year
                  </label>
                  <input
                    type="number"
                    value={bookForm.publishedYear}
                    onChange={(e) => setBookForm({ ...bookForm, publishedYear: parseInt(e.target.value, 10) || 2024 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Total Pages
                  </label>
                  <input
                    type="number"
                    value={bookForm.pages}
                    onChange={(e) => {
                      const p = parseInt(e.target.value, 10) || 200;
                      setBookForm({ ...bookForm, pages: p, readTimeHours: Math.max(1, Math.round(p / 45)) });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-mono"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bookFeaturedCheck"
                    checked={bookForm.featured}
                    onChange={(e) => setBookForm({ ...bookForm, featured: e.target.checked })}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="bookFeaturedCheck" className="text-xs font-semibold cursor-pointer text-stone-700 dark:text-stone-300">
                    Feature on Public Hero Spotlight Showcase
                  </label>
                </div>
              </div>
            )}

            {/* Tab 2: Synopsis & Bio */}
            {modalTab === 'metadata' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Book Summary & Synopsis
                  </label>
                  <textarea
                    rows={4}
                    value={bookForm.summary}
                    onChange={(e) => setBookForm({ ...bookForm, summary: e.target.value })}
                    placeholder="Provide a comprehensive synopsis of the philosophical or architectural treatise..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Author Biography
                  </label>
                  <textarea
                    rows={3}
                    value={bookForm.authorBio}
                    onChange={(e) => setBookForm({ ...bookForm, authorBio: e.target.value })}
                    placeholder="Short scholastic background of the author..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                      Notable Folio Epigraph Quote
                    </label>
                    <input
                      type="text"
                      value={bookForm.quote}
                      onChange={(e) => setBookForm({ ...bookForm, quote: e.target.value })}
                      placeholder="“Memorable quote from the text…”"
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                      Publisher
                    </label>
                    <input
                      type="text"
                      value={bookForm.publisher}
                      onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                      placeholder="e.g. MIT Press"
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Reader Chapter Excerpt */}
            {modalTab === 'excerpt' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                      Chapter Title
                    </label>
                    <input
                      type="text"
                      value={bookForm.sampleExcerpt?.chapterTitle || ''}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          sampleExcerpt: {
                            ...bookForm.sampleExcerpt,
                            chapterTitle: e.target.value,
                            paragraphs: bookForm.sampleExcerpt?.paragraphs || []
                          }
                        })
                      }
                      placeholder="Chapter I: The Architecture of the Inquiry"
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                      Chapter Subtitle (Optional)
                    </label>
                    <input
                      type="text"
                      value={bookForm.sampleExcerpt?.subtitle || ''}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          sampleExcerpt: {
                            ...bookForm.sampleExcerpt,
                            subtitle: e.target.value,
                            paragraphs: bookForm.sampleExcerpt?.paragraphs || []
                          }
                        })
                      }
                      placeholder="On First Principles"
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Excerpt Paragraphs (Separate paragraphs with double Enter / blank line)
                  </label>
                  <textarea
                    rows={6}
                    value={(bookForm.sampleExcerpt?.paragraphs || []).join('\n\n')}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        sampleExcerpt: {
                          ...bookForm.sampleExcerpt,
                          chapterTitle: bookForm.sampleExcerpt?.chapterTitle || 'Chapter I',
                          paragraphs: e.target.value.split('\n\n').map((p) => p.trim()).filter(Boolean)
                        }
                      })
                    }
                    placeholder="Paste the opening paragraphs of the work here. These render directly in the interactive reading room…"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-serif leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200/80 dark:border-stone-800/80">
              <button
                onClick={closeBookModal}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={saveBook}
                className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                {editingBook ? 'Save Changes' : 'Create Book'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#15161c] rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-lg font-bold">Remove Volume from Catalog?</h3>
            <p className="text-xs text-stone-500">
              This will remove the book from the local collection and reader bookshelves.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteBook(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteUserId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setConfirmDeleteUserId(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#15161c] rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-lg font-bold">Delete Reader Account?</h3>
            <p className="text-xs text-stone-500">This action will remove the user login.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteUserId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUser(confirmDeleteUserId);
                  setConfirmDeleteUserId(null);
                  showToast('User account deleted.');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setConfirmResetOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#15161c] rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-lg font-bold text-red-600">Reset to Default Catalog?</h3>
            <p className="text-xs text-stone-500">
              This will restore all 200 standard archival volumes with real covers and discard unexported custom books.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetCatalog();
                  setConfirmResetOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Reset Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};