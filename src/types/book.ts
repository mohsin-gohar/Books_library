export type BookCategory =
  | 'All'
  | 'Architecture & Design'
  | 'Philosophy'
  | 'Science & Technology'
  | 'Literary Fiction'
  | 'Essays & Art'
  | 'History & Civilization'
  | 'Psychology & Mind';

export type ViewMode = 'grid' | 'shelf' | 'compact';
export type DurationFilter = 'all' | 'short' | 'medium' | 'long';
export type EraFilter = 'all' | 'classical' | 'modern' | 'contemporary';

export type ReadingStatus = 'want-to-read' | 'currently-reading' | 'completed';

export interface BookReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  content: string;
}

export interface BookExcerpt {
  chapterTitle: string;
  subtitle?: string;
  paragraphs: string[];
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  coverImage: string;
  category: Exclude<BookCategory, 'All'>;
  rating: number;
  ratingCount: number;
  pages: number;
  publishedYear: number;
  publisher: string;
  isbn: string;
  language: string;
  readTimeHours: number;
  summary: string;
  quote: string;
  quoteAttribution?: string;
  tableOfContents: string[];
  sampleExcerpt: BookExcerpt;
  tags: string[];
  featured?: boolean;
  edition?: string;
  reviews: BookReview[];
}

export type SortOption = 'featured' | 'rating' | 'newest' | 'pages' | 'title';

export interface ReadingProgress {
  bookId: string;
  status: ReadingStatus;
  currentPage: number;
  totalPages: number;
  lastReadDate: string;
}
