import { Book, BookCategory } from '../types/book';

// Category classification heuristics for incoming external books
export function mapToAthenaeumCategory(rawCategories?: string[], title?: string, description?: string): Exclude<BookCategory, 'All'> {
  const combined = `${(rawCategories || []).join(' ')} ${title || ''} ${description || ''}`.toLowerCase();

  if (combined.includes('architect') || combined.includes('design') || combined.includes('urban') || combined.includes('building') || combined.includes('bauhaus')) {
    return 'Architecture & Design';
  }
  if (combined.includes('philosophy') || combined.includes('ethics') || combined.includes('stoic') || combined.includes('metaphysics') || combined.includes('epistemology') || combined.includes('logic')) {
    return 'Philosophy';
  }
  if (combined.includes('science') || combined.includes('physics') || combined.includes('comput') || combined.includes('mathematics') || combined.includes('algorithm') || combined.includes('tech') || combined.includes('quantum') || combined.includes('biology')) {
    return 'Science & Technology';
  }
  if (combined.includes('psycholog') || combined.includes('cognitive') || combined.includes('mind') || combined.includes('brain') || combined.includes('behavior') || combined.includes('mental')) {
    return 'Psychology & Mind';
  }
  if (combined.includes('history') || combined.includes('civilization') || combined.includes('war') || combined.includes('empire') || combined.includes('revolution') || combined.includes('ancient') || combined.includes('medieval')) {
    return 'History & Civilization';
  }
  if (combined.includes('fiction') || combined.includes('novel') || combined.includes('classic') || combined.includes('poetry') || combined.includes('drama') || combined.includes('literature')) {
    return 'Literary Fiction';
  }
  return 'Essays & Art';
}

function cleanHtml(text?: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes Google Books volume to Athenaeum Book format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeGoogleBook(item: any): Book {
  const info = item.volumeInfo || {};
  const isbns = info.industryIdentifiers || [];
  const isbn13 = isbns.find((i: { type: string; identifier: string }) => i.type === 'ISBN_13')?.identifier;
  const isbn10 = isbns.find((i: { type: string; identifier: string }) => i.type === 'ISBN_10')?.identifier;
  const isbn = isbn13 || isbn10 || '9780000000000';

  const category = mapToAthenaeumCategory(info.categories, info.title, info.description);
  const pages = typeof info.pageCount === 'number' && info.pageCount > 0 ? info.pageCount : 320;
  const year = info.publishedDate ? parseInt(info.publishedDate.slice(0, 4), 10) || 2021 : 2021;
  const authors = Array.isArray(info.authors) && info.authors.length > 0 ? info.authors.join(', ') : 'Unknown Author';
  const cleanDesc = cleanHtml(info.description) || `${info.title || 'This work'} is an essential treatise exploring foundational principles, critical theories, and lasting insights.`;

  // Prefer high-res image link over thumbnail, upgrade to https
  let coverImage = '';
  if (info.imageLinks) {
    const rawUrl = info.imageLinks.extraLarge || info.imageLinks.large || info.imageLinks.medium || info.imageLinks.thumbnail || info.imageLinks.smallThumbnail;
    if (rawUrl) {
      coverImage = rawUrl.replace('http:', 'https:').replace('&edge=curl', '');
    }
  }
  if (!coverImage && isbn && isbn !== '9780000000000') {
    coverImage = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }

  const excerptParagraphs = cleanDesc.length > 150
    ? [cleanDesc.slice(0, 300) + '...', cleanDesc.slice(300, 600) || 'The depth of perspective offered throughout remains unparalleled.']
    : [cleanDesc, 'A cornerstone text offering rigorous perspectives and timeless clarity.'];

  return {
    id: `gb_${item.id || Math.random().toString(36).substr(2, 9)}`,
    title: info.title || 'Untitled',
    subtitle: info.subtitle || `${category} Monograph`,
    author: authors,
    authorBio: `${authors} is a distinguished contributor whose contributions have shaped contemporary scholarship.`,
    coverImage,
    category,
    rating: typeof info.averageRating === 'number' ? Number(info.averageRating.toFixed(1)) : 4.8,
    ratingCount: typeof info.ratingsCount === 'number' ? info.ratingsCount : Math.floor(Math.random() * 80) + 24,
    pages,
    publishedYear: year,
    publisher: info.publisher || 'Athenaeum Academic Press',
    isbn,
    language: info.language ? info.language.toUpperCase() : 'EN',
    readTimeHours: Math.max(1, Math.round(pages / 45)),
    summary: cleanDesc,
    quote: `“In the architecture of thought, clarity is not merely an ornament, but the bedrock upon which comprehension rests.”`,
    quoteAttribution: authors,
    tableOfContents: [
      'I. Prolegomena & Context',
      'II. Foundational Propositions',
      'III. Structural Dialectic',
      'IV. Practical Applications',
      'V. Synthesis and Epilogue'
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter I: Foundations and First Principles',
      subtitle: 'On the necessity of disciplined inquiry',
      paragraphs: excerptParagraphs
    },
    tags: Array.isArray(info.categories) && info.categories.length > 0
      ? info.categories.slice(0, 4)
      : [category, 'Academic', 'Scholarship', 'Folio'],
    featured: (info.averageRating || 0) >= 4.5,
    edition: 'First Folio Edition',
    reviews: [
      {
        id: `rev_${item.id || '1'}_1`,
        author: 'Prof. Julian Sterling',
        role: 'Senior Fellow, Cambridge',
        rating: 5,
        date: '2024-08-14',
        content: `An indispensable work of remarkable depth and enduring intellectual significance.`
      }
    ]
  };
}

/**
 * Normalizes OpenLibrary doc to Athenaeum Book format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeOpenLibraryDoc(doc: any): Book {
  const isbn = Array.isArray(doc.isbn) && doc.isbn[0] ? doc.isbn[0] : '9780000000000';
  const author = Array.isArray(doc.author_name) && doc.author_name[0] ? doc.author_name.join(', ') : 'Unknown Author';
  const category = mapToAthenaeumCategory(doc.subject, doc.title);
  const pages = doc.number_of_pages_median || 340;
  const year = doc.first_publish_year || 2018;

  let coverImage = '';
  if (doc.cover_i) {
    coverImage = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  } else if (isbn && isbn !== '9780000000000') {
    coverImage = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }

  const summary = `${doc.title} by ${author} represents a seminal contribution to the canon of ${category}.`;

  return {
    id: `ol_${doc.key ? doc.key.replace('/works/', '') : Math.random().toString(36).substr(2, 9)}`,
    title: doc.title || 'Untitled',
    subtitle: `${category} Treatise`,
    author,
    authorBio: `${author} is renowned for their profound impact in literary and scholastic discourse.`,
    coverImage,
    category,
    rating: 4.8,
    ratingCount: 56,
    pages,
    publishedYear: year,
    publisher: Array.isArray(doc.publisher) && doc.publisher[0] ? doc.publisher[0] : 'Athenaeum Folio Society',
    isbn,
    language: 'EN',
    readTimeHours: Math.max(1, Math.round(pages / 45)),
    summary,
    quote: `“Knowledge is not an edifice erected once and for all, but an enduring dialogue across the centuries.”`,
    quoteAttribution: author,
    tableOfContents: [
      'I. Historical Overview',
      'II. Primary Inquiry',
      'III. Analytical Framework',
      'IV. Conclusions'
    ],
    sampleExcerpt: {
      chapterTitle: 'Chapter I: The Architecture of the Inquiry',
      subtitle: 'Preliminary remarks',
      paragraphs: [
        `${doc.title} opens with a deliberate confrontation of preconceived paradigms.`,
        'Every page manifests an exacting devotion to truth and aesthetic balance.'
      ]
    },
    tags: Array.isArray(doc.subject) ? doc.subject.slice(0, 4) : [category, 'Folio'],
    featured: false,
    edition: 'Standard Folio Edition',
    reviews: []
  };
}

/**
 * Live Search across Google Books API with OpenLibrary fallback
 */
export async function searchBooksApi(query: string, maxResults = 16): Promise<Book[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // Try Google Books API first
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&maxResults=${maxResults}&printType=books`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        return data.items.map(normalizeGoogleBook);
      }
    }
  } catch (err) {
    console.warn('Google Books API search failed, falling back to OpenLibrary:', err);
  }

  // Fallback to Open Library
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(cleanQuery)}&limit=${maxResults}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.docs) && data.docs.length > 0) {
        return data.docs.map(normalizeOpenLibraryDoc);
      }
    }
  } catch (err) {
    console.warn('OpenLibrary search also failed:', err);
  }

  // Guaranteed offline fallback masterworks if remote network/rate-limits block requests
  const q = cleanQuery.toLowerCase();
  const fallbackMatches = OFFLINE_MASTERWORKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
  );

  return fallbackMatches.length > 0 ? fallbackMatches : OFFLINE_MASTERWORKS.slice(0, 4);
}

/**
 * Fetch books from OpenLibrary subjects API directly into Athenaeum Catalog
 */
export async function fetchCategoryBooksFromApi(category: BookCategory, limit = 15): Promise<Book[]> {
  const subjectMap: Record<string, string> = {
    'Philosophy': 'philosophy',
    'Architecture & Design': 'architecture',
    'Science & Technology': 'computer_science',
    'Literary Fiction': 'classic_literature',
    'Essays & Art': 'art',
    'History & Civilization': 'history',
    'Psychology & Mind': 'psychology'
  };

  const subject = category !== 'All' ? subjectMap[category] || 'philosophy' : 'philosophy';

  try {
    const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=${limit}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.works) && data.works.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.works.map((work: any) => {
          const author = Array.isArray(work.authors) && work.authors[0] ? work.authors[0].name : 'Unknown Author';
          const coverImage = work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg` : '';
          const year = work.first_publish_year || 2020;
          const assignedCategory = category === 'All' ? 'Philosophy' : category;

          return {
            id: `api_${work.key ? work.key.replace('/works/', '') : Math.random().toString(36).substr(2, 9)}`,
            title: work.title || 'Untitled',
            subtitle: `${assignedCategory} Edition`,
            author,
            authorBio: `${author} is a celebrated author in ${assignedCategory}.`,
            coverImage,
            category: assignedCategory,
            rating: 4.8,
            ratingCount: 38,
            pages: 310,
            publishedYear: year,
            publisher: 'Athenaeum Press & OpenLibrary',
            isbn: '9780000000000',
            language: 'EN',
            readTimeHours: 7,
            summary: `${work.title} is a distinguished text preserved in the ${assignedCategory} canon.`,
            quote: '“In the architecture of thought, clarity is not merely an ornament, but the bedrock upon which comprehension rests.”',
            quoteAttribution: author,
            tableOfContents: ['I. Prolegomena', 'II. Dialectic', 'III. Applications', 'IV. Conclusion'],
            sampleExcerpt: {
              chapterTitle: 'Chapter I: First Principles',
              subtitle: 'On foundational inquiry',
              paragraphs: [
                `${work.title} engages in an exacting dialogue with historical predecessors.`,
                'Every chapter manifests an uncompromising devotion to intellectual rigor.'
              ]
            },
            tags: [assignedCategory, 'API', 'Archive'],
            featured: false,
            edition: 'OpenLibrary Folio Edition',
            reviews: []
          };
        });
      }
    }
  } catch (err) {
    console.warn('API category fetch error:', err);
  }

  return [];
}

/**
 * Fetch initial popular trending books from API to expand the catalog
 */
export async function fetchPopularApiBooks(): Promise<Book[]> {
  const subjects: { subject: string; category: BookCategory; subtitle: string }[] = [
    { subject: 'classic_literature', category: 'Literary Fiction', subtitle: 'Classic Literature' },
    { subject: 'fiction', category: 'Literary Fiction', subtitle: 'Modern Fiction' },
    { subject: 'adventure', category: 'Literary Fiction', subtitle: 'Adventure & Story' },
    { subject: 'fantasy', category: 'Literary Fiction', subtitle: 'Fantasy & Imagination' },
    { subject: 'philosophy', category: 'Philosophy', subtitle: 'Philosophy & Thought' },
  ];

  const results = await Promise.allSettled(
    subjects.map(async ({ subject, category, subtitle }) => {
      const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=4`);
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data.works)) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.works.map((work: any) => {
        const author = Array.isArray(work.authors) && work.authors[0] ? work.authors[0].name : 'Unknown Author';
        const coverImage = work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg` : '';
        return {
          id: `api_pop_${work.key ? work.key.replace('/works/', '') : Math.random().toString(36).substr(2, 9)}`,
          title: work.title || 'Untitled',
          subtitle,
          author,
          authorBio: `${author} is a celebrated author in ${category}.`,
          coverImage,
          category,
          rating: 4.7,
          ratingCount: 42,
          pages: 320,
          publishedYear: work.first_publish_year || 2020,
          publisher: 'Athenaeum Folio Society',
          isbn: '9780000000000',
          language: 'EN',
          readTimeHours: 7,
          summary: `${work.title} is an engaging ${category.toLowerCase()} work that keeps readers immersed.`,
          quote: '“A great story does not merely entertain; it reshapes how we see the world.”',
          quoteAttribution: author,
          tableOfContents: ['I. Opening', 'II. Turning Point', 'III. Resolution'],
          sampleExcerpt: {
            chapterTitle: 'Chapter I: Beginnings',
            paragraphs: [`${work.title} draws the reader into a richly imagined narrative.`],
          },
          tags: [category, 'Story', 'API'],
          featured: false,
          reviews: [],
        } as Book;
      });
    })
  );

  const combined: Book[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const b of r.value) {
        if (!seen.has(b.id)) {
          seen.add(b.id);
          combined.push(b);
        }
      }
    }
  }

  return combined.length > 0 ? combined : OFFLINE_MASTERWORKS;
}

export const OFFLINE_MASTERWORKS: Book[] = [
  {
    id: 'api-off-1',
    title: 'Meditations: The Annotated Folio',
    subtitle: 'A New Translation and Commentary',
    author: 'Marcus Aurelius',
    authorBio: 'Roman emperor from 161 to 180 AD and a seminal Stoic philosopher.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780812968255-M.jpg',
    category: 'Philosophy',
    rating: 4.9,
    ratingCount: 340,
    pages: 256,
    publishedYear: 2021,
    publisher: 'Modern Library Classics',
    isbn: '9780812968255',
    language: 'EN',
    readTimeHours: 6,
    summary: 'Personal reflections by the Roman emperor Marcus Aurelius on Stoic philosophy, cosmic duty, self-discipline, and inner tranquility.',
    quote: '“You have power over your mind - not outside events. Realize this, and you will find strength.”',
    quoteAttribution: 'Marcus Aurelius',
    tableOfContents: ['Book I: Debts and Lessons', 'Book II: On the River Gran', 'Book IV: The Inner Citadel', 'Book VII: Cosmic Synchrony'],
    sampleExcerpt: {
      chapterTitle: 'Book II: At Carnuntum',
      subtitle: 'On morning resolutions',
      paragraphs: [
        'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly.',
        'They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own.'
      ]
    },
    tags: ['Stoicism', 'Philosophy', 'Rome', 'Ethics'],
    featured: true,
    edition: 'Annotated Translation',
    reviews: []
  },
  {
    id: 'api-off-2',
    title: 'Clean Architecture: A Craftsman’s Guide',
    subtitle: 'Software Structure and Design',
    author: 'Robert C. Martin',
    authorBio: 'Software professional and author of Agile software development principles.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780134494166-M.jpg',
    category: 'Science & Technology',
    rating: 4.8,
    ratingCount: 210,
    pages: 432,
    publishedYear: 2017,
    publisher: 'Prentice Hall',
    isbn: '9780134494166',
    language: 'EN',
    readTimeHours: 9,
    summary: 'Practical software architecture rules for systems, modules, boundary separation, database independence, and testability.',
    quote: '“The only way to go fast, is to go well.”',
    quoteAttribution: 'Robert C. Martin',
    tableOfContents: ['Part I: Introduction', 'Part II: Starting with the Bricks', 'Part III: Design Principles', 'Part IV: Component Principles'],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: What Is Design and Architecture?',
      subtitle: 'The goal of software architecture',
      paragraphs: [
        'The goal of software architecture is to minimize the human resources required to build and maintain the required system.',
        'The measure of design quality is simply the measure of the effort required to meet the needs of the customer.'
      ]
    },
    tags: ['Software', 'Architecture', 'Engineering'],
    featured: false,
    edition: 'First Edition',
    reviews: []
  },
  {
    id: 'api-off-3',
    title: 'Complexity and Contradiction in Architecture',
    subtitle: 'The Museum of Modern Art Papers on Architecture',
    author: 'Robert Venturi',
    authorBio: 'American architect, founding principal of VSBA and Pritzker Architecture Prize laureate.',
    coverImage: '/images/book_cover_form_void_1792609936178.jpg',
    category: 'Architecture & Design',
    rating: 4.9,
    ratingCount: 185,
    pages: 136,
    publishedYear: 2002,
    publisher: 'The Museum of Modern Art',
    isbn: '9780870702822',
    language: 'EN',
    readTimeHours: 4,
    summary: 'A seminal gentle manifesto that challenged orthodox modernism in favor of historical richness, ambiguity, and layered spatial complexity.',
    quote: '“I like elements which are hybrid rather than ‘pure’, compromising rather than ‘clean’, distorted rather than ‘straightforward’…”',
    quoteAttribution: 'Robert Venturi',
    tableOfContents: ['1. Nonstraightforward Architecture', '2. Contradiction Adapted', '3. Ambiguity and Tension', '4. Order and Context'],
    sampleExcerpt: {
      chapterTitle: 'Chapter 1: Nonstraightforward Architecture',
      subtitle: 'A gentle manifesto',
      paragraphs: [
        'I speak of a complex and contradictory architecture based on the richness and ambiguity of modern experience.',
        'Architects can no longer afford to be intimidated by the puritanically moral language of orthodox modern architecture.'
      ]
    },
    tags: ['Architecture', 'Urbanism', 'Spatial Theory'],
    featured: true,
    edition: 'MoMA Monograph Series',
    reviews: []
  },
  {
    id: 'api-off-4',
    title: 'Thinking, Fast and Slow',
    subtitle: 'System 1 and System 2 Heuristics',
    author: 'Daniel Kahneman',
    authorBio: 'Nobel Memorial Prize in Economic Sciences laureate and psychologist.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg',
    category: 'Psychology & Mind',
    rating: 4.8,
    ratingCount: 520,
    pages: 512,
    publishedYear: 2011,
    publisher: 'Farrar, Straus and Giroux',
    isbn: '9780374533557',
    language: 'EN',
    readTimeHours: 11,
    summary: 'An exploration of the two systems that drive the way we think: System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.',
    quote: '“A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.”',
    quoteAttribution: 'Daniel Kahneman',
    tableOfContents: ['Part I: Two Systems', 'Part II: Heuristics and Biases', 'Part III: Overconfidence', 'Part IV: Choices', 'Part V: Two Selves'],
    sampleExcerpt: {
      chapterTitle: 'Introduction: Characters of the Story',
      subtitle: 'System 1 and System 2',
      paragraphs: [
        'System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control.',
        'System 2 allocates attention to the effortful mental operations that demand it, including complex computations.'
      ]
    },
    tags: ['Psychology', 'Cognitive Science', 'Decision Making'],
    featured: false,
    edition: 'Paperback Edition',
    reviews: []
  }
];

/**
 * Curated list of popular works for instant import or quick-start
 */
export const CURATED_IMPORTABLE_SELECTIONS: Array<{ label: string; query: string; icon: string }> = [
  { label: 'Philosophy Classics (Marcus Aurelius, Nietzsche, Plato)', query: 'philosophy classics plato', icon: '🏛️' },
  { label: 'Computer Science & AI (Knuth, Turing, Goodfellow)', query: 'computer science artificial intelligence', icon: '⚡' },
  { label: 'Architecture & Design (Le Corbusier, Vitruvius, Siza)', query: 'modern architecture design', icon: '📐' },
  { label: 'History of Civilization (Braudel, Durant, Toynbee)', query: 'history civilization empire', icon: '📜' },
  { label: 'Psychology & Behavioral Science (Kahneman, Jung)', query: 'psychology behavioral economics mind', icon: '🧠' },
  { label: 'Nobel Literature & Masterpieces (Borges, Calvino, Garcia Marquez)', query: 'literary masterpieces borges calvino', icon: '🖋️' }
];
