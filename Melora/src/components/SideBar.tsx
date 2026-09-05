import "./SideBar.css";

export function SideBar() {
  return (
    <aside className="side-bar">
      <div className="side-bar-logo">
      <h1>Melora</h1>
      </div>

      <nav className="side-bar-nav">
        <a href="/">Home</a>
        <a href="/search">Search</a>
        <a href="/library">Your Library</a>
        <a href="/liked">Liked Songs</a>
      </nav>

      <div className="side-bar-playlists">
        <h2>Your Playlists</h2>

        <button type="button">
          Create Playlist
        </button>
      </div>
    </aside>
  );
}