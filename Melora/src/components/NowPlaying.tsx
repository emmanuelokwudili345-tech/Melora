import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Heart,
  ListPlus,
  MoreHorizontal,
  Pause,
  Play,
  Repeat1,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  User,
} from "lucide-react";
import { usePlayer } from "../context/usePlayer";
import "./NowPlaying.css";

interface NowPlayingProps {
  onClose: () => void;
}

function formatTime(time: number) {
  if (!Number.isFinite(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function NowPlaying({
  onClose,
}: NowPlayingProps) {
  const [isOptionsOpen, setIsOptionsOpen] =
    useState(false);

  const optionsRef = useRef<HTMLDivElement | null>(
    null,
  );

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    repeatMode,
    play,
    pause,
    seek,
    nextTrack,
    previousTrack,
    toggleRepeatMode,
  } = usePlayer();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsOptionsOpen(false);
      }
    }

    if (isOptionsOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isOptionsOpen]);

  if (!currentTrack) {
    return null;
  }

  const artwork =
    currentTrack.artwork?._1000x1000 ??
    currentTrack.artwork?._480x480 ??
    currentTrack.artwork?._150x150;

  function handlePlayPause() {
    if (isPlaying) {
      pause();
      return;
    }

    play();
  }

  function handleProgressChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    seek(Number(event.currentTarget.value));
  }

  function handleOptionsToggle() {
    setIsOptionsOpen((isOpen) => !isOpen);
  }

  function handleCloseOptions() {
    setIsOptionsOpen(false);
  }

  return (
    <section className="now-playing">
      <header className="now-playing-header">
        <button
          type="button"
          className="now-playing-close"
          onClick={onClose}
          aria-label="Close now playing"
        >
          <ChevronDown size={28} />
        </button>

        <p>NOW PLAYING</p>

        <div
          className="now-playing-options-wrapper"
          ref={optionsRef}
        >
          <button
            type="button"
            className="now-playing-options"
            onClick={handleOptionsToggle}
            aria-label="More options"
          >
            <MoreHorizontal size={24} />
          </button>

          {isOptionsOpen && (
            <div
              className="now-playing-options-menu"
              role="menu"
            >
              <button
                type="button"
                onClick={handleCloseOptions}
                role="menuitem"
              >
                <ListPlus size={20} />

                <span>Add to queue</span>
              </button>

              <button
                type="button"
                onClick={handleCloseOptions}
                role="menuitem"
              >
                <User size={20} />

                <span>View artist</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="now-playing-content">
        <div className="now-playing-artwork">
          {artwork && (
            <img
              src={artwork}
              alt={`${currentTrack.title} artwork`}
            />
          )}
        </div>

        <div className="now-playing-track">
          <div>
            <h1>{currentTrack.title}</h1>

            <p>{currentTrack.user.name}</p>
          </div>

          <button
            type="button"
            aria-label="Like song"
          >
            <Heart size={22} />
          </button>
        </div>

        <div className="now-playing-progress">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            aria-label="Song progress"
          />

          <div className="now-playing-time">
            <span>{formatTime(currentTime)}</span>

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="now-playing-controls">
          <button
            type="button"
            aria-label="Shuffle"
          >
            <Shuffle size={22} />
          </button>

          <button
            type="button"
            onClick={previousTrack}
            aria-label="Previous song"
          >
            <SkipBack size={28} />
          </button>

          <button
            type="button"
            className="now-playing-play"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause
                size={28}
                fill="currentColor"
              />
            ) : (
              <Play
                size={28}
                fill="currentColor"
              />
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            aria-label="Next song"
          >
            <SkipForward size={28} />
          </button>

          <button
            type="button"
            className={
              repeatMode !== "off"
                ? "now-playing-control-active"
                : ""
            }
            onClick={toggleRepeatMode}
            aria-label={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === "one" ? (
              <Repeat1 size={22} />
            ) : (
              <Repeat2 size={22} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}