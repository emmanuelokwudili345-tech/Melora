import "./AlbumCard.css";

interface AlbumCardProps {
  title: string;
  artist: string;
  artwork?: string;
  year?: number;
}

export function AlbumCard({
  title,
  artist,
  artwork,
  year,
}: AlbumCardProps) {
  return (
    <article className="album-card">
      <div className="album-card-artwork">
        {artwork && (
          <img
            src={artwork}
            alt={`${title} artwork`}
          />
        )}
      </div>

      <h3>{title}</h3>

      <p>
        {artist}
        {year && ` · ${year}`}
      </p>
    </article>
  );
}