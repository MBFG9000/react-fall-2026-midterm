import BookCard from './BookCard.jsx';

export default function BookList({ books, onSelect }) {
  return (
    <ul className="grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelect={onSelect} />
      ))}
    </ul>
  );
}
