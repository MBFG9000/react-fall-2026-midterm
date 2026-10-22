import { useEffect, useState } from 'react';
import { getBook, updateBook, deleteBook } from '../api/booksApi.js';
import { STATUSES } from '../constants.js';
import BookCover from './BookCover.jsx';
import Field from './Field.jsx';
import StarRating from './StarRating.jsx';
import { Loader, ErrorMessage } from './StatusMessage.jsx';

export default function BookDetail({ id, onBack, onChanged }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  // UI state for updates/deletes, kept separate from the load error so a failed save doesn't hide the book
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getBook(id, controller.signal)
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, retryCount]);

  async function handleStatusChange(e) {
    setSaving(true);
    setActionError(null);
    try {
      const updated = await updateBook(book.id, { status: e.target.value });
      setBook(updated);
      onChanged();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    setActionError(null);
    try {
      await deleteBook(book.id);
      onChanged();
      onBack();
    } catch (err) {
      setActionError(err.message);
      setSaving(false);
      setConfirmingDelete(false);
    }
  }

  let content;
  if (loading) {
    content = <Loader label="Loading book..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={() => setRetryCount((c) => c + 1)} />;
  } else {
    content = (
      <article className="detail">
        <BookCover title={book.title} author={book.author} genre={book.genre} status={book.status} large />
        <div className="detail-body">
          <h1>{book.title}</h1>
          <p className="byline">by {book.author}</p>
          <StarRating value={book.rating} />
          <p className="description">{book.description}</p>
          <dl className="facts">
            <div>
              <dt>Genre</dt>
              <dd>{book.genre}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{book.year}</dd>
            </div>
            <div>
              <dt>Pages</dt>
              <dd>{book.pages}</dd>
            </div>
          </dl>

          <Field label="Reading status">
            <select value={book.status} onChange={handleStatusChange} disabled={saving}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          {actionError && (
            <p className="error" role="alert">
              {actionError}
            </p>
          )}

          {confirmingDelete ? (
            <div className="confirm" role="alertdialog" aria-label="Confirm delete">
              <p>Delete &quot;{book.title}&quot; from your library?</p>
              <div className="form-actions">
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                  {saving ? 'Deleting...' : 'Yes, delete'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setConfirmingDelete(false)} disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn btn-danger" onClick={() => setConfirmingDelete(true)} disabled={saving}>
              Delete book
            </button>
          )}
        </div>
      </article>
    );
  }

  return (
    <section>
      <button type="button" className="btn btn-ghost btn-back" onClick={onBack}>
        Back to your shelf
      </button>
      {content}
    </section>
  );
}
