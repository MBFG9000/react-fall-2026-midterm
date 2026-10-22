// shows first, last and a window around the current page, with gaps as "…"
function pageNumbers(page, totalPages) {
  const nums = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...nums].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push(`gap-${n}`);
    result.push(n);
  });
  return result;
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      {pageNumbers(page, totalPages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="gap">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={item === page ? 'btn btn-active' : 'btn'}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}
      <button type="button" className="btn" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}
