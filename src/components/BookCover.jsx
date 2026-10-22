// each genre is bound in its own shade of green bookcloth
const CLOTH = {
  Fantasy: '#2E5E4E',
  'Sci-Fi': '#1F4F5A',
  Mystery: '#283D33',
  Romance: '#5B7748',
  History: '#66653A',
  Biography: '#4C7564',
  Thriller: '#1E3B2E',
  Science: '#386B66',
};

export default function BookCover({ title, author, genre, status, large = false }) {
  return (
    <div className={large ? 'cover cover-large' : 'cover'} style={{ '--cloth': CLOTH[genre] ?? CLOTH.Fantasy }} aria-hidden="true">
      <span className="cover-title">{title}</span>
      {author && <span className="cover-author">{author}</span>}
      {status === 'reading' && <span className="ribbon" />}
    </div>
  );
}
