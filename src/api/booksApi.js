import { generateBooks } from './seedData.js';
import { DEFAULT_SORT } from '../constants.js';

// Simulated REST API: Promises + artificial delay + localStorage persistence.
const STORAGE_KEY = 'booknook_books_v1';
const DELAY = 600;

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // corrupted storage: fall through and re-seed
    }
  }
  const seed = generateBooks(120);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function writeAll(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// open the site with ?fail to see the error state
function maybeFail() {
  if (new URLSearchParams(window.location.search).has('fail')) {
    throw new Error('Network error: the library server could not be reached.');
  }
}

const SORTERS = {
  'title-asc': (a, b) => a.title.localeCompare(b.title),
  'author-asc': (a, b) => a.author.localeCompare(b.author) || a.title.localeCompare(b.title),
  'rating-desc': (a, b) => b.rating - a.rating || a.title.localeCompare(b.title),
  'year-desc': (a, b) => b.year - a.year,
  'year-asc': (a, b) => a.year - b.year,
  'pages-desc': (a, b) => b.pages - a.pages,
};

export async function getBooks({ search = '', genre = 'all', status = 'all', sort = DEFAULT_SORT, page = 1, pageSize = 12 }, signal) {
  await wait(DELAY, signal);
  maybeFail();
  const term = search.trim().toLowerCase();
  const filtered = readAll()
    .filter((b) => genre === 'all' || b.genre === genre)
    .filter((b) => status === 'all' || b.status === status)
    .filter((b) => !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term))
    .sort(SORTERS[sort] ?? SORTERS[DEFAULT_SORT]);
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total: filtered.length };
}

export async function getBook(id, signal) {
  await wait(DELAY / 2, signal);
  maybeFail();
  const book = readAll().find((b) => b.id === id);
  if (!book) throw new Error('This book no longer exists.');
  return book;
}

export async function addBook(data) {
  await wait(DELAY);
  maybeFail();
  const books = readAll();
  const nextId = books.reduce((max, b) => Math.max(max, b.id), 0) + 1;
  const book = { ...data, id: nextId };
  writeAll([...books, book]);
  return book;
}

export async function updateBook(id, changes) {
  await wait(DELAY / 2);
  maybeFail();
  const books = readAll();
  if (!books.some((b) => b.id === id)) throw new Error('This book no longer exists.');
  const updated = books.map((b) => (b.id === id ? { ...b, ...changes } : b));
  writeAll(updated);
  return updated.find((b) => b.id === id);
}

export async function deleteBook(id) {
  await wait(DELAY / 2);
  maybeFail();
  writeAll(readAll().filter((b) => b.id !== id));
}
