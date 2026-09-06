import { NavLink } from "react-router";
import "./SideBar.css";

export function SideBar() {
  return (
    <aside className="side-bar">
      <div className="side-bar-logo">
        <h1>Melora</h1>
      </div>

      <nav className="side-bar-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/library">Your Library</NavLink>
        <NavLink to="/liked">Liked Songs</NavLink>
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