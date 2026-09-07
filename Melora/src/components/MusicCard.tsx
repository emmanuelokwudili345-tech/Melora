import type { MusicTrack } from "../types/music";
import "./MusicCard.css";

interface MusicCardProps {
  track: MusicTrack;
  onClick: () => void;
}

export function MusicCard({
  track,
  onClick,
}: MusicCardProps) {
  const artwork =
    track.artwork?._480x480 ??
    track.artwork?._150x150;

  return (
    <article
      className="music-card"
      onClick={onClick}
    >
      <div className="music-card-artwork">
        {artwork && (
          <img
            src={artwork}
            alt={`${track.title} artwork`}
          />
        )}
      </div>

      <h3>{track.title}</h3>

      <p>{track.user.name}</p>
    </article>
  );
}