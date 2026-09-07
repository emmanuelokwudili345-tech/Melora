import { useEffect, useState } from "react";
import { usePlayer } from "../../context/usePlayer";
import { MusicCard } from "../../components/MusicCard";
import { getTrendingTracks } from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import "./HomePage.css";

export function HomePage() {
  const [trendingTracks, setTrendingTracks] = useState<MusicTrack[]>([]);

  const { setCurrentTrack, setQueue } = usePlayer();

  useEffect(() => {
    async function loadTrendingTracks() {
      try {
        const tracks = await getTrendingTracks();

        setTrendingTracks(tracks);
        setQueue(tracks);
      } catch (error) {
        console.error("Failed to load trending tracks:", error);
      }
    }

    loadTrendingTracks();
  }, [setQueue]);

  return (
    <div className="home-page">
      <section className="home-greeting">
        <p>Good afternoon Emmanuel</p>

        <h1>Welcome back</h1>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Featured</h2>
        </div>

        <div className="featured-card">
          <div className="featured-content">
            <span>FEATURED</span>

            <h2>Discover something new</h2>

            <p>
              Explore fresh music and find your next
              favorite track.
            </p>

            <button type="button">
              Play Now
            </button>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Trending Tracks</h2>

          <button type="button">
            See all
          </button>
        </div>

        <div className="music-card-grid">
          {trendingTracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              onClick={() => setCurrentTrack(track)}
            />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Recently Played</h2>
        </div>

        <div className="empty-section">
          <p>
            Play some music and your recently played
            tracks will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}