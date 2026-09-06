import {
  Heart,
  ListMusic,
  Maximize2,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { usePlayer } from "../context/usePlayer";
import "./MusicPlayer.css";

export function MusicPlayer() {
  const { currentTrack } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  const artwork =
    currentTrack.artwork?._480x480 ??
    currentTrack.artwork?._150x150;

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
            aria-label="Previous song"
          >
            <SkipBack size={20} />
          </button>

          <button
            type="button"
            className="music-player-play"
            aria-label="Play"
          >
            <Play size={20} fill="currentColor" />
          </button>

          <button
            type="button"
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
          <span>0:00</span>

          <input
            type="range"
            min="0"
            max="100"
            value="0"
            readOnly
            aria-label="Song progress"
          />

          <span>0:00</span>
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
          max="100"
          value="70"
          readOnly
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