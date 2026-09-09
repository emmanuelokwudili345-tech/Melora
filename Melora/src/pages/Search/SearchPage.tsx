import { useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { MusicCard } from "../../components/MusicCard";
import { usePlayer } from "../../context/usePlayer";
import { searchTracks } from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import "./SearchPage.css";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] =
    useState(false);

  const {
    setCurrentTrack,
    setQueue,
  } = usePlayer();

  async function handleSearch() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);

      const tracks =
        await searchTracks(trimmedQuery);

      setSearchResults(tracks);
      setQueue(tracks);
    } catch (error) {
      console.error(
        "Failed to search tracks:",
        error,
      );

      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    handleSearch();
  }

  function handleTrackClick(track: MusicTrack) {
    setCurrentTrack(track);
  }

  return (
    <div className="search-page">
      <section className="search-page-header">
        <h1>Search</h1>

        <p>
          Find songs, artists, and discover new music.
        </p>
      </section>

      <form
        className="search-form"
        onSubmit={handleSubmit}
      >
        <div className="search-input-wrapper">
          <Search size={20} />

          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search for songs..."
            aria-label="Search for songs"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle
              size={18}
              className="search-loading-icon"
            />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {!hasSearched && (
        <div className="search-placeholder">
          <Search size={42} />

          <h2>Search for music</h2>

          <p>
            Find your favorite songs and discover
            something new.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="search-status">
          <LoaderCircle
            size={30}
            className="search-loading-icon"
          />

          <p>Searching for music...</p>
        </div>
      )}

      {!isLoading &&
        hasSearched &&
        searchResults.length === 0 && (
          <div className="search-status">
            <h2>No results found</h2>

            <p>
              Try searching for something else.
            </p>
          </div>
        )}

      {!isLoading &&
        searchResults.length > 0 && (
          <section className="search-results">
            <div className="search-results-header">
              <h2>Results</h2>

              <span>
                {searchResults.length} tracks found
              </span>
            </div>

            <div className="music-card-grid">
              {searchResults.map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  onClick={() =>
                    handleTrackClick(track)
                  }
                />
              ))}
            </div>
          </section>
        )}
    </div>
  );
}