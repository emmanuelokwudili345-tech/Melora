import {
  Menu,
  Search,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import "./NavBar.css";

interface NavBarProps {
  onMenuClick: () => void;
}

export function NavBar({
  onMenuClick,
}: NavBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const name =
    user?.user_metadata?.name || "";

  const initial = name
    .charAt(0)
    .toUpperCase();

  function handleSearchClick() {
    navigate("/search");
  }

  function handleProfileClick() {
    if (user) {
      navigate("/profile");
      return;
    }

    navigate("/auth");
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
        onClick={handleProfileClick}
        aria-label={
          user
            ? "Open profile"
            : "Log in or create an account"
        }
      >
        {user ? (
          <span className="nav-bar-avatar">
            {initial}
          </span>
        ) : (
          <UserCircle size={30} />
        )}
      </button>
    </header>
  );
}