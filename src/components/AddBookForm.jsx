import { useState } from 'react';
import { addBook } from '../api/booksApi.js';
import { GENRES, STATUSES } from '../constants.js';
import Field from './Field.jsx';

const EMPTY_FORM = {
  title: '',
  author: '',
  genre: GENRES[0],
  year: '',
  pages: '',
  rating: '3',
  status: 'to-read',
  description: '',
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required.';
  if (!form.author.trim()) errors.author = 'Author is required.';
  const year = Number(form.year);
  if (!form.year || !Number.isInteger(year) || year < 1000 || year > new Date().getFullYear()) {
    errors.year = 'Enter a valid year.';
  }
  const pages = Number(form.pages);
  if (!form.pages || !Number.isInteger(pages) || pages < 1 || pages > 5000) {
    errors.pages = 'Pages must be between 1 and 5000.';
  }
  return errors;
}

export default function AddBookForm({ onAdded, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleClear() {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const book = await addBook({
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre,
        year: Number(form.year),
        pages: Number(form.pages),
        rating: Number(form.rating),
        status: form.status,
        description: form.description.trim() || 'No description yet.',
      });
      onAdded(book);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="page-title">Add a book</h1>
      <p className="page-lede">Fill in the catalog card. Title, author, year and pages are required.</p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field label="Title" error={errors.title}>
          <input name="title" value={form.title} onChange={handleChange} />
        </Field>

        <Field label="Author" error={errors.author}>
          <input name="author" value={form.author} onChange={handleChange} />
        </Field>

        <div className="form-row">
          <Field label="Genre">
            <select name="genre" value={form.genre} onChange={handleChange}>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Rating">
            <select name="rating" value={form.rating} onChange={handleChange}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="form-row">
          <Field label="Year published" error={errors.year}>
            <input name="year" type="number" value={form.year} onChange={handleChange} />
          </Field>

          <Field label="Pages" error={errors.pages}>
            <input name="pages" type="number" value={form.pages} onChange={handleChange} />
          </Field>
        </div>

        <Field label="Description">
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
        </Field>

        {submitError && (
          <p className="error" role="alert">
            {submitError}
          </p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add book'}
          </button>
          <button type="button" className="btn" onClick={handleClear} disabled={submitting}>
            Clear
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
