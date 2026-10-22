// Shared domain constants used by the API, the seed data and the UI.
export const GENRES = ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'History', 'Biography', 'Thriller', 'Science'];

export const STATUSES = [
  { value: 'to-read', label: 'To read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
];

export const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'author-asc', label: 'Author (A-Z)' },
  { value: 'rating-desc', label: 'Rating (high first)' },
  { value: 'year-desc', label: 'Newest first' },
  { value: 'year-asc', label: 'Oldest first' },
  { value: 'pages-desc', label: 'Longest first' },
];

export const DEFAULT_SORT = 'title-asc';

export function getStatusLabel(value) {
  return STATUSES.find((s) => s.value === value)?.label ?? value;
}
