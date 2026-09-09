import { useEffect } from "react";
import {
  Heart,
  Home,
  Library,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import "./SideBar.css";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideBar({
  isOpen,
  onClose,
}: SideBarProps) {
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, onClose]);

  function handleNavigation() {
    onClose();
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="side-bar-backdrop"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`side-bar ${
          isOpen ? "side-bar-open" : ""
        }`}
      >
        <div className="side-bar-header">
          <h1>Melora</h1>

          <button
            type="button"
            className="side-bar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="side-bar-nav">
          <Link
            to="/"
            onClick={handleNavigation}
            className={
              location.pathname === "/"
                ? "side-bar-link-active"
                : ""
            }
          >
            <Home size={19} />
            <span>Home</span>
          </Link>

          <Link
            to="/search"
            onClick={handleNavigation}
            className={
              location.pathname === "/search"
                ? "side-bar-link-active"
                : ""
            }
          >
            <Search size={19} />
            <span>Search</span>
          </Link>

          <Link
            to="/library"
            onClick={handleNavigation}
            className={
              location.pathname === "/library"
                ? "side-bar-link-active"
                : ""
            }
          >
            <Library size={19} />
            <span>Your Library</span>
          </Link>

          <Link
            to="/liked"
            onClick={handleNavigation}
            className={
              location.pathname === "/liked"
                ? "side-bar-link-active"
                : ""
            }
          >
            <Heart size={19} />
            <span>Liked Songs</span>
          </Link>
        </nav>

        <div className="side-bar-playlists">
          <h2>Your Playlists</h2>

          <button
            type="button"
            className="side-bar-create-playlist"
          >
            <Plus size={18} />
            <span>Create Playlist</span>
          </button>
        </div>
      </aside>
    </>
  );
}