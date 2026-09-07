import { usePlayer } from "../../context/usePlayer";
import { useEffect, useState } from "react";
import { getTrendingTracks } from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import { AlbumCard } from "../../components/AlbumCard";
import { ArtistCard } from "../../components/ArtistCard";
import { MusicCard } from "../../components/MusicCard";
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
            <span>FEATURED PLAYLIST</span>

            <h2>Discover something new</h2>

            <p>Explore fresh music and find your next favorite track.</p>

            <button type="button">Play Now</button>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Trending Tracks</h2>

          <button type="button">See all</button>
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

          <button type="button">See all</button>
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
          <h2>Made For You</h2>

          <button type="button">See all</button>
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

          <button type="button">See all</button>
        </div>

        <div className="trending-list">
            {trendingTracks.slice(0, 4).map((track, index) => (
              <div className="trending-row" key={track.id}>
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
            </div>
          ))}
       </div>
     </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Popular Artists</h2>

          <button type="button">See all</button>
        </div>

        <div className="artist-card-grid">
          <ArtistCard name="Artist One" />
          <ArtistCard name="Artist Two" />
          <ArtistCard name="Artist Three" />
          <ArtistCard name="Artist Four" />
          <ArtistCard name="Artist Five" />
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>New Releases</h2>

          <button type="button">See all</button>
        </div>

        <div className="album-card-grid">
          <AlbumCard
            title="New Beginnings"
            artist="Artist One"
            year={2026}
          />

          <AlbumCard
            title="After Midnight"
            artist="Artist Two"
            year={2026}
          />

          <AlbumCard
            title="Golden Skies"
            artist="Artist Three"
            year={2026}
          />

          <AlbumCard
            title="The Journey"
            artist="Artist Four"
            year={2026}
          />
        </div>
      </section>
    </div>
  );
}