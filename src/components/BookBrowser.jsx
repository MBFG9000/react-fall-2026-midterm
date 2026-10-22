import { useEffect, useState } from 'react';
import { getBooks } from '../api/booksApi.js';
import { DEFAULT_SORT } from '../constants.js';
import useDebounce from '../hooks/useDebounce.js';
import FilterBar from './FilterBar.jsx';
import BookList from './BookList.jsx';
import Pagination from './Pagination.jsx';
import { Loader, ErrorMessage, EmptyState } from './StatusMessage.jsx';

const PAGE_SIZE = 12;
const DEFAULT_FILTERS = { search: '', genre: 'all', status: 'all', sort: DEFAULT_SORT };

export default function BookBrowser({ refreshKey, onSelect }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const debouncedSearch = useDebounce(filters.search);
  const { genre, status, sort } = filters;

  useEffect(() => {
    // each run gets its own controller; cleanup aborts the previous request,
    // so a slow old response can never overwrite a newer one (race condition)
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getBooks({ search: debouncedSearch, genre, status, sort, page, pageSize: PAGE_SIZE }, controller.signal)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSearch, genre, status, sort, page, refreshKey, retryCount]);

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  // e.g. the last book on the last page was deleted: step back to a page that exists
  useEffect(() => {
    if (!loading && page > totalPages) setPage(totalPages);
  }, [loading, page, totalPages]);

  function handleFilterChange(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  // derived during render, not stored in state
  const canReset = Object.keys(DEFAULT_FILTERS).some((key) => filters[key] !== DEFAULT_FILTERS[key]);

  let content;
  if (loading) {
    content = <Loader label="Loading books..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={() => setRetryCount((c) => c + 1)} />;
  } else if (result.items.length === 0) {
    content = (
      <EmptyState
        title="No books match your search"
        hint="Try a different keyword or clear the filters."
        onAction={handleReset}
        actionLabel="Clear filters"
      />
    );
  } else {
    content = (
      <>
        <BookList books={result.items} onSelect={onSelect} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </>
    );
  }

  return (
    <section>
      <div className="shelf-head">
        <h1>Your shelf</h1>
        <p className="count" aria-live="polite">
          {!loading && !error && `${result.total} book${result.total === 1 ? '' : 's'}${canReset ? ' match' : ''}`}
        </p>
      </div>
      <FilterBar {...filters} onChange={handleFilterChange} onReset={handleReset} canReset={canReset} />
      {content}
    </section>
  );
}
