import { MusicCard } from "../../components/MusicCard";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-page">
      <section className="home-greeting">
        <p>Good afternoon Emmanuel</p>
        <h1>Welcome back</h1>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Featured</h2>
        </div>

        <div className="featured-card">
          <div className="featured-content">
            <span>FEATURED PLAYLIST</span>

            <h2>Discover something new</h2>

            <p>
              Explore fresh music and find your next favorite track.
            </p>

            <button type="button">
              Play Now
            </button>
          </div>
        </div>
      </section>

      <section className="home-section">
  <div className="section-header">
    <h2>Recently Played</h2>

    <button type="button">
      See all
    </button>
  </div>

  <div className="music-card-grid">
    <MusicCard
      title="Midnight Drive"
      artist="Melora Artist"
     />

    <MusicCard
      title="Golden Hour"
      artist="Melora Artist"
    />

    <MusicCard
      title="After Hours"
      artist="Melora Artist"
    />

    <MusicCard
      title="Ocean Lights"
      artist="Melora Artist"
    />
  </div>
 </section>
  </div>
  );
}