import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { ListMinus, ListPlus } from "lucide-react";
import { usePlaylist } from "../context/usePlaylist";
import {
  getPlaylistIdForTrack,
} from "../services/playlists";
import type { MusicTrack } from "../types/music";
import "./PlaylistMenu.css";

interface PlaylistMenuProps {
  track: MusicTrack;
  playlistId?: string;
  onTrackRemoved?: (trackId: string) => void;
}

export function PlaylistMenu({
  track,
  playlistId,
  onTrackRemoved,
}: PlaylistMenuProps) {
  const {
    playlists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
  } = usePlaylist();

  const [isOpen, setIsOpen] = useState(false);
  const [addedPlaylistId, setAddedPlaylistId] =
    useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuAlign, setMenuAlign] =
    useState<"left" | "right">("right");

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isAdded = addedPlaylistId !== null;
  const isPlaylistPage = Boolean(playlistId);

  useEffect(() => {
    let isCancelled = false;

    async function checkPlaylist() {
      try {
        const playlistId =
          await getPlaylistIdForTrack(track.id);

        if (!isCancelled) {
          setAddedPlaylistId(playlistId);
        }
      } catch (error) {
        console.error(
          "Failed to check playlist:",
          error,
        );
      }
    }

    checkPlaylist();

    return () => {
      isCancelled = true;
    };
  }, [track.id]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trigger = triggerRef.current;

    if (trigger) {
      const triggerRect = trigger.getBoundingClientRect();
      const menuWidth = 220;
      const padding = 12;
      const overflowRight =
        window.innerWidth -
          triggerRect.right <
        menuWidth + padding;
      const overflowLeft =
        triggerRect.left < menuWidth + padding;

      setMenuAlign(
        overflowRight && !overflowLeft
          ? "left"
          : "right",
      );
    }

    function handleClickOutside(
      event: globalThis.MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isOpen]);

  async function handleAddToPlaylist(
    selectedPlaylistId: string,
  ) {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      await addTrackToPlaylist(
        selectedPlaylistId,
        track,
      );

      setAddedPlaylistId(selectedPlaylistId);
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Failed to add track to playlist:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveFromPlaylist() {
    if (!addedPlaylistId || isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      await removeTrackFromPlaylist(
        addedPlaylistId,
        track.id,
      );

      setAddedPlaylistId(null);
      onTrackRemoved?.(track.id);
    } catch (error) {
      console.error(
        "Failed to remove track from playlist:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleTriggerClick(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    if (isAdded || isPlaylistPage) {
      handleRemoveFromPlaylist();
      return;
    }

    setIsOpen((current) => !current);
  }

  function handleMenuClick(
    event: MouseEvent<HTMLDivElement>,
  ) {
    event.stopPropagation();
  }

  return (
    <div
      ref={menuRef}
      className="playlist-menu"
      onClick={handleMenuClick}
    >
      <button
        ref={triggerRef}
        type="button"
        className="playlist-menu-trigger"
        onClick={handleTriggerClick}
        disabled={isLoading}
        aria-label={
          isAdded || isPlaylistPage
            ? `Remove ${track.title} from playlist`
            : `Add ${track.title} to a playlist`
        }
      >
        {isAdded || isPlaylistPage ? (
          <ListMinus size={18} />
        ) : (
          <ListPlus size={18} />
        )}
      </button>

      {!isPlaylistPage && isOpen && (
        <div
          className="playlist-menu-dropdown"
          data-align={menuAlign}
        >
          <div className="playlist-menu-header">
            <strong>Add to playlist</strong>
          </div>

          {playlists.length === 0 ? (
            <p className="playlist-menu-status">
              You haven't created any playlists yet.
            </p>
          ) : (
            <div className="playlist-menu-list">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  className="playlist-menu-item"
                  onClick={() =>
                    handleAddToPlaylist(playlist.id)
                  }
                  disabled={isLoading}
                >
                  <span>{playlist.name}</span>
                  <ListPlus size={16} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}