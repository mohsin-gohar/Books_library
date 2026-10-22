import { Book, BookCategory } from '../types/book';
import { BOOKS_CATALOG } from './booksCatalog';
import { STORY_BOOKS } from './storyBooks';

export const BOOKS_DATA: Book[] = [...STORY_BOOKS, ...BOOKS_CATALOG];

export const CATEGORIES: Exclude<BookCategory, 'All'>[] = [
  'Architecture & Design',
  'Philosophy',
  'Science & Technology',
  'Literary Fiction',
  'Essays & Art',
  'History & Civilization',
  'Psychology & Mind'
];
