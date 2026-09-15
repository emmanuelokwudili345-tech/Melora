import { useEffect, useState } from "react";
import {
  ArrowLeft,
  LoaderCircle,
  Play,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router";
import { MusicCard } from "../../components/MusicCard";
import { usePlayer } from "../../context/usePlayer";
import { usePlaylist } from "../../context/usePlaylist";
import {
  getPlaylistById,
  type Playlist,
  type PlaylistTrack,
} from "../../services/playlists";
import "./PlaylistDetails.css";

export function PlaylistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    setCurrentTrack,
    setQueue,
  } = usePlayer();

  const {
    getPlaylistTracks,
  } = usePlaylist();

  const [playlist, setPlaylist] =
    useState<Playlist | null>(null);
  const [tracks, setTracks] =
    useState<PlaylistTrack[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const playlistId = id;

    async function loadPlaylist() {
      try {
        setIsLoading(true);
        setError("");

        const [
          playlistData,
          playlistTracks,
        ] = await Promise.all([
          getPlaylistById(playlistId),
          getPlaylistTracks(playlistId),
        ]);

        if (!playlistData) {
          setError("Playlist not found.");
          return;
        }

        setPlaylist(playlistData);
        setTracks(playlistTracks);
      } catch (error) {
        console.error(
          "Failed to load playlist:",
          error,
        );

        setError(
          "We couldn't load this playlist. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaylist();
  }, [id, getPlaylistTracks]);

  function handlePlayPlaylist() {
    if (tracks.length === 0) {
      return;
    }

    const playlistTracks = tracks.map(
      (item) => item.track_data,
    );

    setQueue(playlistTracks);
    setCurrentTrack(playlistTracks[0]);
  }

  function handleTrackClick(
    track: PlaylistTrack,
  ) {
    setQueue(
      tracks.map((item) => item.track_data),
    );
    setCurrentTrack(track.track_data);
  }

  function handleTrackRemoved(
    trackId: string,
  ) {
    setTracks((currentTracks) =>
      currentTracks.filter(
        (track) =>
          track.track_id !== trackId,
      ),
    );

    setMessage("Removed from playlist.");

    window.setTimeout(() => {
      setMessage("");
    }, 1500);
  }

  if (!id) {
    return (
      <div className="playlist-details-status">
        <h2>Playlist unavailable</h2>
        <p>
          This playlist could not be found.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Go home
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="playlist-details-status">
        <LoaderCircle
          size={30}
          className="playlist-details-loading"
        />
        <p>Loading playlist...</p>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="playlist-details-status">
        <h2>Playlist unavailable</h2>
        <p>
          {error ||
            "This playlist could not be found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="playlist-details">
      <button
        type="button"
        className="playlist-details-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={19} />
        <span>Back</span>
      </button>

      <section className="playlist-details-header">
        <div className="playlist-details-artwork">
          <div className="playlist-details-artwork-placeholder">
            <Play
              size={48}
              fill="currentColor"
            />
          </div>
        </div>

        <div className="playlist-details-info">
          <span>PLAYLIST</span>

          <h1>{playlist.name}</h1>

          <p>
            {tracks.length}{" "}
            {tracks.length === 1
              ? "track"
              : "tracks"}
          </p>

          <button
            type="button"
            className="playlist-details-play"
            onClick={handlePlayPlaylist}
            disabled={tracks.length === 0}
          >
            <Play
              size={19}
              fill="currentColor"
            />
            <span>Play</span>
          </button>
        </div>
      </section>

      <section className="playlist-details-tracks">
        <div className="playlist-details-tracks-header">
          <h2>Tracks</h2>
        </div>

        {message && (
          <p className="playlist-details-message">
            {message}
          </p>
        )}

        {tracks.length === 0 ? (
          <div className="playlist-details-empty">
            <h3>This playlist is empty</h3>
            <p>
              Add songs to your playlist to see
              them here.
            </p>
          </div>
        ) : (
          <div className="music-card-grid">
            {tracks.map((track) => (
              <MusicCard
                key={track.id}
                track={track.track_data}
                playlistId={playlist.id}
                onTrackRemoved={
                  handleTrackRemoved
                }
                onClick={() =>
                  handleTrackClick(track)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}