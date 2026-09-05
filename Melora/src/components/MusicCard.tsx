import "./MusicCard.css";

interface MusicCardProps {
  title: string;
  artist: string;
  artwork?: string;
}

export function MusicCard({
  title,
  artist,
  artwork,
}: MusicCardProps) {
  return (
    <article className="music-card">
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