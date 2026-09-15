import { useEffect, useState } from "react";
import {
  Heart,
  Home,
  Library,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";
import { useAuth } from "../context/useAuth";
import { usePlaylist } from "../context/usePlaylist";
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    playlists,
    createPlaylist,
  } = usePlaylist();

  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [playlistName, setPlaylistName] =
    useState("");
  const [isCreating, setIsCreating] =
    useState(false);
  const [playlistError, setPlaylistError] =
    useState("");

  const name =
    user?.user_metadata?.name || "Melora User";

  const initial = name.charAt(0).toUpperCase();

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

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    function handleModalEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        if (isCreating) {
          return;
        }

        setIsModalOpen(false);
        setPlaylistName("");
        setPlaylistError("");
      }
    }

    document.addEventListener(
      "keydown",
      handleModalEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleModalEscape,
      );
    };
  }, [isModalOpen, isCreating]);

  function handleNavigation() {
    onClose();
  }

  function handleProfileClick() {
    onClose();
    navigate("/profile");
  }

  function handleCreatePlaylistClick() {
    setPlaylistName("");
    setPlaylistError("");
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (isCreating) {
      return;
    }

    setIsModalOpen(false);
    setPlaylistName("");
    setPlaylistError("");
  }

  async function handleCreatePlaylist() {
    const trimmedName =
      playlistName.trim();

    if (!trimmedName) {
      setPlaylistError(
        "Please enter a playlist name.",
      );
      return;
    }

    try {
      setIsCreating(true);
      setPlaylistError("");

      await createPlaylist(trimmedName);

      setIsModalOpen(false);
      setPlaylistName("");
    } catch (error) {
      console.error(
        "Failed to create playlist:",
        error,
      );

      setPlaylistError(
        "We couldn't create the playlist. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function handlePlaylistClick(
    playlistId: string,
  ) {
    onClose();
    navigate(`/playlist/${playlistId}`);
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
            onClick={handleCreatePlaylistClick}
          >
            <Plus size={18} />
            <span>Create Playlist</span>
          </button>

          {playlists.length > 0 && (
            <div className="side-bar-playlist-list">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  className="side-bar-playlist"
                  onClick={() =>
                    handlePlaylistClick(
                      playlist.id,
                    )
                  }
                >
                  <span>{playlist.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="side-bar-profile"
          onClick={handleProfileClick}
        >
          <span className="side-bar-avatar">
            {initial}
          </span>

          <span className="side-bar-profile-info">
            <strong>{name}</strong>
            <span>View profile</span>
          </span>

          <UserCircle size={18} />
        </button>
      </aside>

      {isModalOpen && (
        <div
          className="playlist-modal-backdrop"
          onMouseDown={handleCloseModal}
        >
          <div
            className="playlist-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="playlist-modal-header">
              <h2>Create Playlist</h2>

              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close"
                disabled={isCreating}
              >
                <X size={20} />
              </button>
            </div>

            <div className="playlist-modal-body">
              <label htmlFor="playlist-name">
                Playlist name
              </label>

              <input
                id="playlist-name"
                type="text"
                value={playlistName}
                onChange={(event) =>
                  setPlaylistName(
                    event.target.value,
                  )
                }
                placeholder="My playlist"
                maxLength={50}
                autoFocus
                disabled={isCreating}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !isCreating
                  ) {
                    handleCreatePlaylist();
                  }
                }}
              />

              {playlistError && (
                <p className="playlist-modal-error">
                  {playlistError}
                </p>
              )}
            </div>

            <div className="playlist-modal-actions">
              <button
                type="button"
                className="playlist-modal-cancel"
                onClick={handleCloseModal}
                disabled={isCreating}
              >
                Cancel
              </button>

              <button
                type="button"
                className="playlist-modal-create"
                onClick={handleCreatePlaylist}
                disabled={isCreating}
              >
                {isCreating
                  ? "Creating..."
                  : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}