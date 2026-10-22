import BookCover from './BookCover.jsx';
import StarRating from './StarRating.jsx';
import { getStatusLabel } from '../constants.js';

export default function BookCard({ book, onSelect }) {
  return (
    <li>
      <button type="button" className="book" onClick={() => onSelect(book.id)}>
        <BookCover title={book.title} genre={book.genre} status={book.status} />
        <span className="book-title">{book.title}</span>
        <span className="book-author">{book.author}</span>
        <span className="book-meta">
          <StarRating value={book.rating} />
          <span className={`book-status book-status-${book.status}`}>{getStatusLabel(book.status)}</span>
        </span>
      </button>
    </li>
  );
}
