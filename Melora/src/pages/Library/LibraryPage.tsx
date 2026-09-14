import {
  Clock3,
  Heart,
  ListMusic,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLikedTracks } from "../../context/useLikedTracks";
import "./LibraryPage.css";

export function LibraryPage() {
  const navigate = useNavigate();
  const { likedTracks } = useLikedTracks();

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
            Everything you save and create in Melora,
            all in one place.
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

          <span className="library-card-arrow">→</span>
        </button>

        <div className="library-card">
          <div className="library-card-icon">
            <ListMusic size={24} />
          </div>

          <div className="library-card-content">
            <h2>Playlists</h2>
            <p>
              Create and organize your favorite music.
            </p>
          </div>

          <span className="library-card-status">
            Coming soon
          </span>
        </div>

        <div className="library-card">
          <div className="library-card-icon">
            <Clock3 size={24} />
          </div>

          <div className="library-card-content">
            <h2>Recently Played</h2>
            <p>
              Keep track of the music you've been
              listening to.
            </p>
          </div>

          <span className="library-card-status">
            Coming soon
          </span>
        </div>
      </section>
    </div>
  );
}