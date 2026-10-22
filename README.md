# BookNook - Personal Library (React SPA)

A single page app for browsing and managing a personal book collection. Midterm project for the React course.

**Live demo:** https://mbfg9000.github.io/react-fall-2026-midterm/

## Features

- 120 pre-generated books served by a **simulated async API** (Promises, 600 ms delay, `localStorage` persistence)
- List view (card grid) and detail view (change reading status, delete with in-app confirmation)
- Controlled "Add book" form with validation and a Clear (reset) action
- Debounced search (title/author), genre and status filters, 6 sort options, pagination (12 per page), reset button
- Loading, error (with retry), empty and success states
- Responsive layout, no direct DOM manipulation

Add `?fail` to the URL (e.g. `http://localhost:5173/?fail`) to see the error state.

## Component structure

```
App                 view state (list / detail / add), refresh counter
├─ BookBrowser      filters, page, fetching, loading/error/empty states
│  ├─ FilterBar
│  ├─ BookList → BookCard → BookCover, StarRating
│  └─ Pagination
├─ BookDetail       fetches one book, status update, delete
└─ AddBookForm      controlled form + validation
```

Shared: `Field` (label + control + error, via `children`), `StatusMessage` (Loader, ErrorMessage, EmptyState), `useDebounce` hook.

```
src/
├─ api/booksApi.js     simulated API (getBooks, getBook, addBook, updateBook, deleteBook)
├─ api/seedData.js     deterministic generator for the 120 initial books
├─ constants.js        genres, statuses, sort options (shared by API and UI)
├─ hooks/useDebounce.js
└─ components/         UI components
```

## React concepts used

- `useState` for filters, page, form values, loading/error state; updates are immutable (`{...prev, ...}`)
- `useEffect` with full dependency arrays; cleanup uses `AbortController` to cancel stale requests (race conditions) and `clearTimeout` for the debounce
- Stable keys (`book.id`); `key={view.id}` on `BookDetail` resets its state when a different book is opened
- `BookBrowser` stays mounted (hidden) while viewing details, so state is preserved

## Run locally

```bash
npm install
npm run dev
```

## Deploy

The app deploys to GitHub Pages automatically on every push to `main` via `.github/workflows/deploy.yml` (install → `npm run build` → publish `dist/`).

One-time setup: in the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

The Vite `base` is `./`, so the build works from the `https://<user>.github.io/<repo>/` path without extra config.
