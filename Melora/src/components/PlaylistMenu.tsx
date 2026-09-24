import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import { ListMinus, ListPlus, X } from "lucide-react";
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

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
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

    setIsOpen(true);
  }

  function handleModalClick(
    event: MouseEvent<HTMLDivElement>,
  ) {
    event.stopPropagation();
  }

  function handleBackdropClick() {
    if (isLoading) {
      return;
    }

    setIsOpen(false);
  }

  return (
    <>
      <button
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
          className="add-playlist-modal-backdrop"
          onMouseDown={handleBackdropClick}
        >
          <div
            className="add-playlist-modal"
            onMouseDown={handleModalClick}
          >
            <div className="add-playlist-modal-header">
              <h2>Add to Playlist</h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>

            {playlists.length === 0 ? (
              <p className="add-playlist-modal-status">
                You haven't created any
                playlists yet.
              </p>
            ) : (
              <div className="add-playlist-modal-list">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    type="button"
                    className="add-playlist-modal-item"
                    onClick={() =>
                      handleAddToPlaylist(
                        playlist.id,
                      )
                    }
                    disabled={isLoading}
                  >
                    <span>{playlist.name}</span>
                    <ListPlus size={17} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}