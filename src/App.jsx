import { useState } from 'react';
import BookBrowser from './components/BookBrowser.jsx';
import BookDetail from './components/BookDetail.jsx';
import AddBookForm from './components/AddBookForm.jsx';

export default function App() {
  const [view, setView] = useState({ name: 'list' });
  // bumped after any write so the browser re-fetches the list
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);
  const showList = () => setView({ name: 'list' });

  return (
    <div className="app">
      <header className="header">
        <button type="button" className="logo" onClick={showList}>
          BookNook
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setView({ name: 'add' })}
          aria-current={view.name === 'add' ? 'page' : undefined}
        >
          Add a book
        </button>
      </header>

      <main className="main">
        {/* the browser stays mounted (just hidden) so filters, sort and page are kept when coming back from a detail view */}
        <div hidden={view.name !== 'list'}>
          <BookBrowser refreshKey={refreshKey} onSelect={(id) => setView({ name: 'detail', id })} />
        </div>

        {view.name === 'detail' && (
          // key resets the detail state whenever a different book is opened
          <BookDetail key={view.id} id={view.id} onBack={showList} onChanged={refresh} />
        )}

        {view.name === 'add' && (
          <AddBookForm
            onCancel={showList}
            onAdded={(book) => {
              refresh();
              setView({ name: 'detail', id: book.id });
            }}
          />
        )}
      </main>

      <footer className="footer">Your library is saved in this browser.</footer>
    </div>
  );
}
