import { useEffect, useState } from "react";
import { usePlayer } from "../../context/usePlayer";
import { MusicCard } from "../../components/MusicCard";
import { getTrendingTracks } from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import { ArtistCard } from "../../components/ArtistCard";
import "./HomePage.css";

export function HomePage() {
  const [trendingTracks, setTrendingTracks] = useState<MusicTrack[]>([]);

  const { setCurrentTrack, setQueue } = usePlayer();

  const popularArtists = Array.from(
    new Map(
      trendingTracks.map((track) => [
        track.user.id,
        track.user,
      ]),
    ).values(),
  );

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
          <h2>Trending Now</h2>

          <button type="button">
            See all
          </button>
        </div>

        <div className="trending-list">
          {trendingTracks.slice(0, 5).map((track, index) => (
            <button
              type="button"
              className="trending-row"
              key={track.id}
              onClick={() => setCurrentTrack(track)}
            >
              <span className="trending-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="trending-artwork">
                {track.artwork?._150x150 && (
                  <img
                    src={track.artwork._150x150}
                    alt={`${track.title} artwork`}
                  />
                )}
              </div>

              <div className="trending-track-info">
                <strong>{track.title}</strong>

                <p>{track.user.name}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Popular Artists</h2>

          <button type="button">
            See all
          </button>
        </div>

        <div className="artist-card-grid">
          {popularArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              name={artist.name}
              image={
                artist.profilePicture?._480x480 ??
                artist.profilePicture?._150x150
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}