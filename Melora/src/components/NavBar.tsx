import { useNavigate } from "react-router";
import "./NavBar.css";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <header className="nav-bar">
      <button
        type="button"
        className="nav-bar-brand"
        onClick={() => navigate("/")}
      >
        <span className="nav-bar-logo">M</span>
        <span>Melora</span>
      </button>

      <div className="nav-bar-search">
        <input
          type="search"
          placeholder="Search songs, artists, albums..."
          aria-label="Search music"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              navigate("/search");
            }
          }}
        />
      </div>

      <button
        type="button"
        className="nav-bar-profile"
        onClick={() => navigate("/profile")}
      >
        <span className="profile-avatar">P</span>
        <span className="profile-text">Profile</span>
      </button>
    </header>
  );
}