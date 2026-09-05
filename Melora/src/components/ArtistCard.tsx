import "./ArtistCard.css";

interface ArtistCardProps {
  name: string;
  image?: string;
}

export function ArtistCard({
  name,
  image,
}: ArtistCardProps) {
  return (
    <article className="artist-card">
      <div className="artist-card-image">
        {image && (
          <img
            src={image}
            alt={name}
          />
        )}
      </div>

      <h3>{name}</h3>
      <p>Artist</p>
    </article>
  );
}