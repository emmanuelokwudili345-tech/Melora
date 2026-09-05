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

      <h3 style={{
        textAlign: "center"
      }}>{name}</h3>
      <p style={{
        textAlign: 'center'
      }}>Artist</p>
    </article>
  );
}