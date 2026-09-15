import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  LoaderCircle,
  Pause,
  Play,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useLikedTracks } from "../../context/useLikedTracks";
import { usePlayer } from "../../context/usePlayer";
import { getTrackById } from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import "./TrendingDetails.css";

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function formatPlayCount(count?: number) {
  if (!count) {
    return "0";
  }

  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }

  return count.toString();
}

export function TrendingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] =
    useState<MusicTrack | null>(null);

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

  const {
    isTrackLiked,
    likeTrack,
    unlikeTrack,
  } = useLikedTracks();

  const isCurrentTrack =
    currentTrack?.id === track?.id;

  const isLiked = track
    ? isTrackLiked(track.id)
    : false;

  useEffect(() => {
    if (!id) {
      return;
    }

    const trackId = id;

    async function loadTrack() {
      try {
        setIsLoading(true);
        setHasError(false);

        const data = await getTrackById(trackId);

        if (!data) {
          setHasError(true);
          return;
        }

        setTrack(data);
      } catch (error) {
        console.error(
          "Failed to load track:",
          error,
        );

        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadTrack();
  }, [id]);

  function handlePlay() {
    if (!track) {
      return;
    }

    if (isCurrentTrack) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }

      return;
    }

    setQueue([track]);
    setCurrentTrack(track);
  }

  async function handleLikeClick() {
    if (!track) {
      return;
    }

    try {
      if (isLiked) {
        await unlikeTrack(track.id);
      } else {
        await likeTrack(track);
      }
    } catch (error) {
      console.error(
        "Failed to update liked track:",
        error,
      );
    }
  }

  if (isLoading) {
    return (
      <div className="trending-details-status">
        <LoaderCircle
          size={30}
          className="trending-details-loading"
        />

        <p>Loading track...</p>
      </div>
    );
  }

  if (hasError || !track) {
    return (
      <div className="trending-details-status">
        <h1>Track not found</h1>

        <p>
          We couldn't find the track you're looking
          for.
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
    track.artwork?._1000x1000 ??
    track.artwork?._480x480 ??
    track.artwork?._150x150;

  return (
    <div className="trending-details-page">
      <button
        type="button"
        className="trending-details-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={19} />
        <span>Back</span>
      </button>

      <section className="trending-details-hero">
        <div className="trending-details-artwork">
          {artwork ? (
            <img
              src={artwork}
              alt={`${track.title} artwork`}
            />
          ) : (
            <div className="trending-details-artwork-placeholder" />
          )}
        </div>

        <div className="trending-details-info">
          <span className="trending-details-label">
            TRACK
          </span>

          <h1>{track.title}</h1>

          <button
            type="button"
            className="trending-details-artist"
            onClick={() =>
              navigate(`/artist/${track.user.id}`)
            }
          >
            {track.user.name}
          </button>

          <div className="trending-details-actions">
            <button
              type="button"
              className="trending-details-play"
              onClick={handlePlay}
            >
              {isCurrentTrack && isPlaying ? (
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
                {isCurrentTrack && isPlaying
                  ? "Pause"
                  : "Play"}
              </span>
            </button>

            <button
              type="button"
              className={`trending-details-like ${
                isLiked
                  ? "trending-details-like-active"
                  : ""
              }`}
              onClick={handleLikeClick}
              aria-label={
                isLiked
                  ? `Unlike ${track.title}`
                  : `Like ${track.title}`
              }
            >
              <Heart
                size={20}
                fill={
                  isLiked
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>
        </div>
      </section>

      <section className="trending-details-meta">
        <div>
          <span>Duration</span>
          <strong>
            {formatDuration(track.duration)}
          </strong>
        </div>

        <div>
          <span>Plays</span>
          <strong>
            {formatPlayCount(track.playCount)}
          </strong>
        </div>

        <div>
          <span>Genre</span>
          <strong>
            {track.genre || "Unknown"}
          </strong>
        </div>

        <div>
          <span>Artist</span>
          <strong>{track.user.name}</strong>
        </div>
      </section>
    </div>
  );
}