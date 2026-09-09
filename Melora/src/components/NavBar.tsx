import {
  Menu,
  Search,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import "./NavBar.css";

interface NavBarProps {
  onMenuClick: () => void;
}

export function NavBar({
  onMenuClick,
}: NavBarProps) {
  const navigate = useNavigate();

  function handleSearchClick() {
    navigate("/search");
  }

  return (
    <header className="nav-bar">
      <button
        type="button"
        className="nav-bar-menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <div className="nav-bar-logo">
        <h1>Melora</h1>
      </div>

      <div className="nav-bar-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search music..."
          aria-label="Search music"
          onFocus={handleSearchClick}
          readOnly
        />
      </div>

      <button
        type="button"
        className="nav-bar-mobile-search"
        onClick={handleSearchClick}
        aria-label="Search"
      >
        <Search size={21} />
      </button>

      <button
        type="button"
        className="nav-bar-profile"
        aria-label="Open profile"
        onClick={() => navigate("/profile")}
      >
        <UserCircle size={30} />
      </button>
    </header>
  );
}