import {
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { usePlayer } from "../context/usePlayer";
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
  const {
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  play,
  pause,
  seek,
  setVolume,
  nextTrack,
  previousTrack,
} = usePlayer();

  if (!currentTrack) {
    return null;
  }

  const artwork =
    currentTrack.artwork?._480x480 ??
    currentTrack.artwork?._150x150;

    function handleVolumeChange(
      event: React.ChangeEvent<HTMLInputElement>,
      ) {
        setVolume(Number(event.target.value));
      }

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
    seek(Number(event.target.value));
  }

  return (
    <section className="music-player">
      <div className="music-player-track">
        {artwork && (
          <img
            src={artwork}
            alt={`${currentTrack.title} artwork`}
            className="music-player-artwork"
          />
        )}

        <div className="music-player-info">
          <h3>{currentTrack.title}</h3>
          <p>{currentTrack.user.name}</p>
        </div>

        <button
          type="button"
          className="music-player-action"
          aria-label="Like song"
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="music-player-center">
        <div className="music-player-controls">
          <button
            type="button"
            aria-label="Shuffle"
          >
            <Shuffle size={18} />
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
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
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
            aria-label="Repeat"
          >
            <Repeat2 size={18} />
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
          aria-label="Queue"
        >
          <ListMusic size={20} />
        </button>

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
  );
}