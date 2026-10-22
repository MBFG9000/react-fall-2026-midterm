export default function StarRating({ value }) {
  return (
    <span className="stars" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'star on' : 'star'} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}
