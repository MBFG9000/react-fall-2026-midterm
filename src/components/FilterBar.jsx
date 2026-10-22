import { GENRES, STATUSES, SORT_OPTIONS } from '../constants.js';
import Field from './Field.jsx';

export default function FilterBar({ search, genre, status, sort, onChange, onReset, canReset }) {
  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} role="search">
      <Field label="Search" grow>
        <input
          type="search"
          value={search}
          placeholder="Title or author..."
          onChange={(e) => onChange('search', e.target.value)}
        />
      </Field>

      <Field label="Genre">
        <select value={genre} onChange={(e) => onChange('genre', e.target.value)}>
          <option value="all">All genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Status">
        <select value={status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="all">Any status</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Sort by">
        <select value={sort} onChange={(e) => onChange('sort', e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <button type="button" className="btn btn-ghost" onClick={onReset} disabled={!canReset}>
        Reset
      </button>
    </form>
  );
}
