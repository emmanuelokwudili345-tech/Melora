import "./MusicCard.css";

interface MusicCardProps {
  title: string;
  artist: string;
  artwork?: string;
  onClick?: () => void;
}

export function MusicCard({
  title,
  artist,
  artwork,
  onClick,
}: MusicCardProps) {
  return (
    <article
      className="music-card"
      onClick={onClick}
    >
      <div className="music-card-artwork">
        {artwork && (
          <img
            src={artwork}
            alt={`${title} artwork`}
          />
        )}
      </div>

      <h3>{title}</h3>

      <p>{artist}</p>
    </article>
  );
}