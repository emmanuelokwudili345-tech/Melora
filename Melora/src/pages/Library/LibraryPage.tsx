import { useEffect, useState } from "react";
import {
  Clock3,
  Heart,
  ListMusic,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router";
import { MusicCard } from "../../components/MusicCard";
import { useLikedTracks } from "../../context/useLikedTracks";
import { usePlayer } from "../../context/usePlayer";
import { usePlaylist } from "../../context/usePlaylist";
import {
  getRecentlyPlayed,
  type RecentlyPlayedTrack,
} from "../../services/recentlyPlayed";
import "./LibraryPage.css";

export function LibraryPage() {
  const navigate = useNavigate();

  const { likedTracks } =
    useLikedTracks();

  const {
    playlists,
    isLoading: isLoadingPlaylists,
  } = usePlaylist();

  const {
    setCurrentTrack,
    setQueue,
  } = usePlayer();

  const [recentlyPlayed, setRecentlyPlayed] =
    useState<RecentlyPlayedTrack[]>([]);

  const [isLoadingRecent, setIsLoadingRecent] =
    useState(true);

  useEffect(() => {
    async function loadRecentlyPlayed() {
      try {
        setIsLoadingRecent(true);

        const tracks =
          await getRecentlyPlayed();

        setRecentlyPlayed(tracks);
      } catch (error) {
        console.error(
          "Failed to load recently played tracks:",
          error,
        );
      } finally {
        setIsLoadingRecent(false);
      }
    }

    loadRecentlyPlayed();
  }, []);

  function handleRecentTrackClick(
    track: RecentlyPlayedTrack,
  ) {
    const tracks = recentlyPlayed.map(
      (item) => item.track_data,
    );

    setQueue(tracks);
    setCurrentTrack(track.track_data);
  }

  return (
    <div className="library-page">
      <section className="library-hero">
        <div className="library-hero-icon">
          <Music size={28} />
        </div>

        <div>
          <span>YOUR COLLECTION</span>
          <h1>Your Library</h1>
          <p>
            Everything you save and create in
            Melora, all in one place.
          </p>
        </div>
      </section>

      <section className="library-sections">
        <button
          type="button"
          className="library-card library-card-liked"
          onClick={() => navigate("/liked")}
        >
          <div className="library-card-icon">
            <Heart size={24} />
          </div>

          <div className="library-card-content">
            <h2>Liked Songs</h2>
            <p>
              {likedTracks.length}{" "}
              {likedTracks.length === 1
                ? "song"
                : "songs"}{" "}
              you saved
            </p>
          </div>

          <span className="library-card-arrow">
            →
          </span>
        </button>

        <div className="library-card">
          <div className="library-card-icon">
            <ListMusic size={24} />
          </div>

          <div className="library-card-content">
            <h2>Playlists</h2>
            <p>
              {isLoadingPlaylists
                ? "Loading playlists..."
                : `${playlists.length} ${playlists.length === 1 ? "playlist" : "playlists"} in your library`}
            </p>
          </div>
        </div>

        <div className="library-card">
          <div className="library-card-icon">
            <Clock3 size={24} />
          </div>

          <div className="library-card-content">
            <h2>Recently Played</h2>
            <p>
              {recentlyPlayed.length}{" "}
              {recentlyPlayed.length === 1
                ? "song"
                : "songs"}{" "}
              recently played
            </p>
          </div>
        </div>
      </section>

      <section className="library-recent">
        <div className="library-section-header">
          <div>
            <span>LISTENING HISTORY</span>
            <h2>Recently Played</h2>
          </div>
        </div>

        {isLoadingRecent ? (
          <p className="library-status">
            Loading recently played...
          </p>
        ) : recentlyPlayed.length === 0 ? (
          <div className="library-empty">
            <Clock3 size={28} />
            <h3>No recently played songs</h3>
            <p>
              Start listening to music and your
              recently played tracks will appear
              here.
            </p>
          </div>
        ) : (
          <div className="library-track-grid">
            {recentlyPlayed.map((item) => (
              <MusicCard
                key={item.id}
                track={item.track_data}
                onClick={() =>
                  handleRecentTrackClick(item)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}