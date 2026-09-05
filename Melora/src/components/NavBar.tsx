import './NavBar.css';

export function NavBar() {
  return (
    <header className="nav-bar">
      <div className="nav-bar-navigation">
        <button type="button" aria-label="Go back">
          Back
        </button>

        <button type="button" aria-label="Go forward">
          Forward
        </button>
      </div>

      <div className="nav-bar-search">
        <input
          type="search"
          placeholder="Search songs, artists, albums..."
          aria-label="Search music"
        />
      </div>

      <div className="nav-bar-actions">
        <button type="button" aria-label="Notifications">
          Notifications
        </button>

        <button type="button">
          Profile
        </button>
      </div>
    </header>
  );
}