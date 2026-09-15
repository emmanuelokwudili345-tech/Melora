import { useState } from "react";
import {
  ChevronUp,
  Heart,
  Maximize2,
  Pause,
  Play,
  Repeat1,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useLikedTracks } from "../context/useLikedTracks";
import { usePlayer } from "../context/usePlayer";
import { NowPlaying } from "./NowPlaying";
import "./MusicPlayer.css";

function formatTime(time: number) {
  if (!Number.isFinite(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const [isNowPlayingOpen, setIsNowPlayingOpen] =
    useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    isShuffleEnabled,
    play,
    pause,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    toggleRepeatMode,
    toggleShuffle,
  } = usePlayer();

  const {
    isTrackLiked,
    likeTrack,
    unlikeTrack,
  } = useLikedTracks();

  if (!currentTrack) {
    return null;
  }

  const track = currentTrack;
  const isLiked = isTrackLiked(track.id);

  const artwork =
    track.artwork?._480x480 ??
    track.artwork?._150x150;

  function handlePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function handleProgressChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    seek(Number(event.currentTarget.value));
  }

  function handleVolumeChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setVolume(Number(event.currentTarget.value));
  }

  async function handleLikeClick() {
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

  return (
    <>
      <section className="music-player">
        <button
          type="button"
          className="music-player-expand"
          onClick={() => setIsNowPlayingOpen(true)}
          aria-label="Expand player"
        >
          <ChevronUp size={20} />
        </button>

        <div className="music-player-track">
          {artwork && (
            <img
              src={artwork}
              alt={`${track.title} artwork`}
              className="music-player-artwork"
            />
          )}

          <div className="music-player-info">
            <h3>{track.title}</h3>
            <p>{track.user.name}</p>
          </div>

          <button
            type="button"
            className={`music-player-action ${
              isLiked ? "music-player-action-active" : ""
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
              fill={isLiked ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="music-player-center">
          <div className="music-player-controls">
            <button
              type="button"
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
              className={`music-player-shuffle ${
                isShuffleEnabled
                  ? "music-player-control-active"
                  : ""
              }`}
            >
              <Shuffle size={18} />

              {isShuffleEnabled && (
                <span className="music-player-shuffle-dot" />
              )}
            </button>

            <button
              type="button"
              onClick={previousTrack}
              aria-label="Previous song"
            >
              <SkipBack size={20} />
            </button>

            <button
              type="button"
              className="music-player-play"
              onClick={handlePlayPause}
              aria-label={
                isPlaying ? "Pause" : "Play"
              }
            >
              {isPlaying ? (
                <Pause
                  size={20}
                  fill="currentColor"
                />
              ) : (
                <Play
                  size={20}
                  fill="currentColor"
                />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next song"
            >
              <SkipForward size={20} />
            </button>

            <button
              type="button"
              onClick={toggleRepeatMode}
              aria-label={`Repeat mode: ${repeatMode}`}
              className={
                repeatMode !== "off"
                  ? "music-player-control-active"
                  : ""
              }
            >
              {repeatMode === "one" ? (
                <Repeat1 size={18} />
              ) : (
                <Repeat2 size={18} />
              )}
            </button>
          </div>

          <div className="music-player-progress">
            <span>{formatTime(currentTime)}</span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              aria-label="Song progress"
            />

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="music-player-extra">
          <button
            type="button"
            aria-label="Volume"
          >
            <Volume2 size={20} />
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
          />

          <button
            type="button"
            aria-label="Fullscreen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </section>

      {isNowPlayingOpen && (
        <NowPlaying
          onClose={() => setIsNowPlayingOpen(false)}
        />
      )}
    </>
  );
}