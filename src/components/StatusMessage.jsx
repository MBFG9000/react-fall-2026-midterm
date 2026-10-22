export function Loader({ label = 'Loading...' }) {
  return (
    <div className="status" role="status">
      <div className="loader" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>{label}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status status-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, hint, onAction, actionLabel }) {
  return (
    <div className="status">
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
      {onAction && (
        <button type="button" className="btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
