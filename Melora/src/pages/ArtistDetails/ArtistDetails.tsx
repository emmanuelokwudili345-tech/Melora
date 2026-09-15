import { useEffect, useState } from "react";
import {
  ArrowLeft,
  LoaderCircle,
  Pause,
  Play,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { MusicCard } from "../../components/MusicCard";
import { usePlayer } from "../../context/usePlayer";
import { getTracksByUserId } from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import "./ArtistDetails.css";

export function ArtistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tracks, setTracks] =
    useState<MusicTrack[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasError, setHasError] =
    useState(false);

  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setQueue,
    play,
    pause,
  } = usePlayer();

  const artist =
    tracks.length > 0 ? tracks[0].user : null;

  const isArtistTrackPlaying =
    currentTrack?.user.id === artist?.id &&
    isPlaying;

  useEffect(() => {
    if (!id) {
      return;
    }

    const userId = id;

    async function loadArtistTracks() {
      try {
        setIsLoading(true);
        setHasError(false);

        const data =
          await getTracksByUserId(userId);

        if (!data.length) {
          setHasError(true);
          return;
        }

        setTracks(data);
      } catch (error) {
        console.error(
          "Failed to load artist tracks:",
          error,
        );

        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadArtistTracks();
  }, [id]);

  function handlePlayArtist() {
    if (!tracks.length) {
      return;
    }

    if (
      currentTrack?.user.id === artist?.id
    ) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }

      return;
    }

    setQueue(tracks);
    setCurrentTrack(tracks[0]);
  }

  function handleTrackClick(track: MusicTrack) {
    navigate(`/track/${track.id}`);
  }

  if (isLoading) {
    return (
      <div className="artist-details-status">
        <LoaderCircle
          size={30}
          className="artist-details-loading"
        />
        <p>Loading artist...</p>
      </div>
    );
  }

  if (hasError || !artist) {
    return (
      <div className="artist-details-status">
        <h1>Artist not found</h1>
        <p>
          We couldn't find any tracks from this
          artist.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>Go back</span>
        </button>
      </div>
    );
  }

  const artwork =
    artist.profilePicture?._1000x1000 ??
    artist.profilePicture?._480x480 ??
    artist.profilePicture?._150x150;

  return (
    <div className="artist-details-page">
      <button
        type="button"
        className="artist-details-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={19} />
        <span>Back</span>
      </button>

      <section className="artist-details-hero">
        <div className="artist-details-artwork">
          {artwork ? (
            <img
              src={artwork}
              alt={`${artist.name} profile`}
            />
          ) : (
            <div className="artist-details-artwork-placeholder">
              {artist.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="artist-details-info">
          <span className="artist-details-label">
            ARTIST
          </span>

          <h1>{artist.name}</h1>

          <p className="artist-details-handle">
            @{artist.handle}
          </p>

          <p className="artist-details-track-count">
            {tracks.length}{" "}
            {tracks.length === 1
              ? "track"
              : "tracks"}
          </p>

          <button
            type="button"
            className="artist-details-play"
            onClick={handlePlayArtist}
          >
            {isArtistTrackPlaying ? (
              <Pause
                size={19}
                fill="currentColor"
              />
            ) : (
              <Play
                size={19}
                fill="currentColor"
              />
            )}

            <span>
              {isArtistTrackPlaying
                ? "Pause"
                : "Play"}
            </span>
          </button>
        </div>
      </section>

      <section className="artist-details-tracks">
        <div className="artist-details-section-header">
          <div>
            <span>CATALOG</span>
            <h2>Tracks</h2>
          </div>

          <span>
            {tracks.length}{" "}
            {tracks.length === 1
              ? "track"
              : "tracks"}
          </span>
        </div>

        <div className="music-card-grid">
          {tracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              onClick={() =>
                handleTrackClick(track)
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}