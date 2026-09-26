import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { usePlayer } from "../../context/usePlayer";
import { useAuth } from "../../context/useAuth";
import { MusicCard } from "../../components/MusicCard";
import { ArtistCard } from "../../components/ArtistCard";
import {
  getNewReleases,
  getTrendingTracks,
} from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import { useNavigate } from "react-router";
import "./HomePage.css";

export function HomePage() {
  const [trendingTracks, setTrendingTracks] = useState<MusicTrack[]>([]);
  const [newReleases, setNewReleases] = useState<MusicTrack[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingNewReleases, setIsLoadingNewReleases] = useState(true);
  const navigate = useNavigate();
  const { setQueue } = usePlayer();
  const { user } = useAuth();

  const name =
    user?.user_metadata?.name?.split(" ")[0] || "there";

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  useEffect(() => {
    async function loadMusic() {
      try {
        setIsLoadingTrending(true);
        const tracks = await getTrendingTracks();

        setTrendingTracks(tracks);
        setQueue(tracks);
      } catch (error) {
        console.error("Failed to load trending tracks:", error);
      } finally {
        setIsLoadingTrending(false);
      }
    }

    loadMusic();
  }, [setQueue]);

  useEffect(() => {
    async function loadNewReleases() {
      try {
        setIsLoadingNewReleases(true);
        const tracks = await getNewReleases();

        setNewReleases(tracks);
      } catch (error) {
        console.error(
          "Failed to load new releases:",
          error,
        );
      } finally {
        setIsLoadingNewReleases(false);
      }
    }

    loadNewReleases();
  }, []);

  const popularArtists = Array.from(
    new Map(
      trendingTracks.map((track) => [
        track.user.id,
        {
          name: track.user.name,
          image:
            track.user.profilePicture?._480x480 ??
            track.user.profilePicture?._150x150,
        },
      ]),
    ).values(),
  );

  const featuredTrack = trendingTracks[0];

  return (
    <div className="home-page">
      <section className="home-greeting">
        <h1>
          {greeting}, {name}
        </h1>

        <p>
          Welcome back. What do you want to listen to?
        </p>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Featured</h2>
        </div>

        {isLoadingTrending ? (
          <div className="featured-card featured-card-skeleton">
            <div className="featured-content">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-copy" />
              <div className="skeleton-line skeleton-copy short" />
              <div className="skeleton-button" />
            </div>
          </div>
        ) : (
          <div
            className="featured-card"
            style={{
              backgroundImage: featuredTrack?.artwork?._1000x1000
                ? `linear-gradient(
                    90deg,
                    rgba(11, 11, 15, 0.95),
                    rgba(11, 11, 15, 0.55),
                    rgba(11, 11, 15, 0.2)
                  ),
                  url(${featuredTrack.artwork._1000x1000})`
                : undefined,
            }}
          >
            <div className="featured-content">
              <h2>
                {featuredTrack?.title ??
                  "Discover something new"}
              </h2>

              <p>
                {featuredTrack
                  ? `Listen to ${featuredTrack.user.name} and discover your next favorite track.`
                  : "Explore fresh music and find your next favorite track."}
              </p>

              <button
                type="button"
                onClick={() => {
                  if (!featuredTrack) {
                    return;
                  }

                  setQueue(trendingTracks);
                  navigate(`/track/${featuredTrack.id}`);
                }}
                disabled={!featuredTrack}
              >
                Play Now
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Trending Tracks</h2>

          <button type="button">
            See all
          </button>
        </div>

        {isLoadingTrending ? (
          <div className="home-skeleton-grid home-tracks-skeleton">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="home-card-skeleton" />
            ))}
          </div>
        ) : trendingTracks.length > 0 ? (
          <div className="music-card-grid">
            {trendingTracks.map((track) => (
              <MusicCard
                key={track.id}
                track={track}
                onClick={() => navigate(`/track/${track.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="home-empty-state">
            No trending tracks available right now.
          </p>
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Trending Now</h2>
        </div>

        {isLoadingTrending ? (
          <div className="trending-list trending-list-skeleton">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="trending-row skeleton-row">
                <span className="trending-number skeleton-number" />
                <div className="trending-artwork skeleton-artwork" />
                <div className="trending-track-info">
                  <div className="skeleton-line skeleton-track-name" />
                  <div className="skeleton-line skeleton-artist-name" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="trending-list">
            {trendingTracks.slice(0, 5).map((track, index) => (
              <div
                className="trending-row"
                key={track.id}
                onClick={() => navigate(`/track/${track.id}`)}
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
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Popular Artists</h2>
        </div>

        {isLoadingTrending ? (
          <div className="artist-card-grid artist-skeleton-grid">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="artist-skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="artist-card-grid">
            {popularArtists.map((artist) => (
              <ArtistCard
                key={artist.name}
                name={artist.name}
                image={artist.image}
              />
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>New Releases</h2>

          <button type="button">
            See all
          </button>
        </div>

        {isLoadingNewReleases ? (
          <div className="new-releases-grid new-releases-skeleton">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="home-card-skeleton" />
            ))}
          </div>
        ) : newReleases.length > 0 ? (
          <div className="new-releases-grid">
            {newReleases.map((track) => (
              <MusicCard
                key={track.id}
                track={track}
                onClick={() => navigate(`/track/${track.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="home-empty-state">
            New releases will appear here soon.
          </p>
        )}
      </section>

      {isLoadingTrending && (
        <div className="home-page-loader" aria-live="polite">
          <LoaderCircle className="home-page-loader-icon" size={18} />
          <span>Loading music...</span>
        </div>
      )}
    </div>
  );
}