import { useState } from "react";
import {
  Heart,
  Play,
  Shuffle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLikedTracks } from "../../context/useLikedTracks";
import { usePlayer } from "../../context/usePlayer";
import "./LikedPage.css";

export function LikedPage() {
  const [isShuffleLoading, setIsShuffleLoading] =
    useState(false);

  const navigate = useNavigate();

  const {
    likedTracks,
    isLoading,
    isTrackLiked,
    likeTrack,
    unlikeTrack,
  } = useLikedTracks();

  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setQueue,
  } = usePlayer();

  function handlePlayAll() {
    if (likedTracks.length === 0) {
      return;
    }

    setQueue(likedTracks);
    setCurrentTrack(likedTracks[0]);
  }

  function handleShuffle() {
    if (likedTracks.length === 0 || isShuffleLoading) {
      return;
    }

    setIsShuffleLoading(true);

    const shuffledTracks = [...likedTracks];

    for (
      let index = shuffledTracks.length - 1;
      index > 0;
      index -= 1
    ) {
      const randomIndex = Math.floor(
        Math.random() * (index + 1),
      );

      [
        shuffledTracks[index],
        shuffledTracks[randomIndex],
      ] = [
        shuffledTracks[randomIndex],
        shuffledTracks[index],
      ];
    }

    setQueue(shuffledTracks);
    setCurrentTrack(shuffledTracks[0]);

    setTimeout(() => {
      setIsShuffleLoading(false);
    }, 300);
  }

  function handleTrackClick(index: number) {
    setQueue(likedTracks);
    setCurrentTrack(likedTracks[index]);
  }

  async function handleLikeClick(
    trackId: string,
  ) {
    const track = likedTracks.find(
      (item) => item.id === trackId,
    );

    if (!track) {
      return;
    }

    try {
      if (isTrackLiked(trackId)) {
        await unlikeTrack(trackId);
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
      <section className="liked-page">
        <div className="liked-page-loading">
          <div className="liked-page-loading-icon">
            <Heart size={28} />
          </div>

          <p>Loading your liked songs...</p>
        </div>
      </section>
    );
  }

  if (likedTracks.length === 0) {
    return (
      <section className="liked-page">
        <div className="liked-page-empty">
          <div className="liked-page-empty-icon">
            <Heart size={32} />
          </div>

          <h1>Liked Songs</h1>

          <p>
            Save songs you love and they’ll appear here
            for easy access.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Explore Music
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="liked-page">
      <header className="liked-page-header">
        <div className="liked-page-header-art">
          <Heart
            size={42}
            fill="currentColor"
          />
        </div>

        <div className="liked-page-header-content">
          <span>YOUR COLLECTION</span>

          <h1>Liked Songs</h1>

          <p>
            {likedTracks.length}{" "}
            {likedTracks.length === 1
              ? "song"
              : "songs"}{" "}
            you love
          </p>
        </div>
      </header>

      <div className="liked-page-actions">
        <button
          type="button"
          className="liked-page-play"
          onClick={handlePlayAll}
        >
          <Play
            size={18}
            fill="currentColor"
          />
          <span>Play All</span>
        </button>

        <button
          type="button"
          className="liked-page-shuffle"
          onClick={handleShuffle}
          disabled={isShuffleLoading}
        >
          <Shuffle size={18} />
          <span>Shuffle</span>
        </button>
      </div>

      <div className="liked-page-list">
        <div className="liked-page-list-header">
          <span>#</span>
          <span>Song</span>
          <span>Artist</span>
          <span />
        </div>

        {likedTracks.map((track, index) => {
          const artwork =
            track.artwork?._480x480 ??
            track.artwork?._150x150;

          const isCurrentTrack =
            currentTrack?.id === track.id;

          return (
            <article
              key={track.id}
              className={`liked-page-track ${
                isCurrentTrack
                  ? "liked-page-track-active"
                  : ""
              }`}
              onClick={() =>
                handleTrackClick(index)
              }
            >
              <span className="liked-page-track-number">
                {isCurrentTrack && isPlaying ? (
                  <span className="liked-page-playing">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  index + 1
                )}
              </span>

              <div className="liked-page-track-info">
                <div className="liked-page-track-art">
                  {artwork && (
                    <img
                      src={artwork}
                      alt={`${track.title} artwork`}
                    />
                  )}
                </div>

                <div className="liked-page-track-details">
                  <h2>{track.title}</h2>
                  <p>{track.user.name}</p>
                </div>
              </div>

              <p className="liked-page-track-artist">
                {track.user.name}
              </p>

              <button
                type="button"
                className="liked-page-track-like"
                onClick={(event) => {
                  event.stopPropagation();
                  handleLikeClick(track.id);
                }}
                aria-label={`Unlike ${track.title}`}
              >
                <Heart
                  size={19}
                  fill="currentColor"
                />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}