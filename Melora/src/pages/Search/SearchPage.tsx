import { useState } from "react";
import {
  CircleX,
  LoaderCircle,
  Search,
} from "lucide-react";
import { MusicCard } from "../../components/MusicCard";
import { usePlayer } from "../../context/usePlayer";
import { searchTracks } from "../../services/audius";
import type { MusicTrack } from "../../types/music";
import "./SearchPage.css";

type ToastType = "success" | "error";

interface Toast {
  type: ToastType;
  message: string;
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] =
    useState(false);
  const [toast, setToast] =
    useState<Toast | null>(null);

  const {
    setCurrentTrack,
    setQueue,
  } = usePlayer();

  function showToast(
    type: ToastType,
    message: string,
  ) {
    setToast({
      type,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 4000);
  }

  function getSearchErrorMessage(
    message: string,
  ) {
    const normalizedMessage =
      message.toLowerCase();

    if (
      normalizedMessage.includes("network") ||
      normalizedMessage.includes("fetch") ||
      normalizedMessage.includes("failed to fetch")
    ) {
      return "Unable to connect. Please check your internet connection and try again.";
    }

    return "We couldn't complete your search. Please try again.";
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      showToast(
        "error",
        "Please enter something to search for.",
      );
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      setToast(null);
      setSearchResults([]);

      const tracks = await searchTracks(
        trimmedQuery,
      );

      setSearchResults(tracks);
      setQueue(tracks);
    } catch (error) {
      console.error(
        "Failed to search tracks:",
        error,
      );

      setSearchResults([]);

      if (error instanceof Error) {
        showToast(
          "error",
          getSearchErrorMessage(error.message),
        );
      } else {
        showToast(
          "error",
          "We couldn't complete your search. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleTrackClick(track: MusicTrack) {
    setCurrentTrack(track);
  }

  function handleClearSearch() {
    setQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setToast(null);
  }

  return (
    <div className="search-page">
      {toast && (
        <div
          className={`search-toast search-toast-${toast.type}`}
          role="status"
        >
          <span className="search-toast-icon">
            {toast.type === "success"
              ? "✓"
              : "!"}
          </span>

          <p>{toast.message}</p>
        </div>
      )}

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
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search for songs..."
            aria-label="Search for songs"
          />

          {query && (
            <button
              type="button"
              className="search-clear-button"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <CircleX size={18} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="search-submit-button"
          disabled={isLoading}
          aria-label="Search"
        >
          {isLoading ? (
            <LoaderCircle
              size={18}
              className="search-loading-icon"
            />
          ) : (
            <>
              <span>Search</span>
              <Search size={20} />
            </>
          )}
        </button>
      </form>

      {!hasSearched && (
        <div className="search-placeholder">
          <div className="search-placeholder-icon">
            <Search size={30} />
          </div>

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
            <div className="search-empty-icon">
              <Search size={28} />
            </div>

            <h2>No results found</h2>

            <p>
              We couldn't find anything for "
              {query.trim()}".
            </p>
          </div>
        )}

      {!isLoading &&
        searchResults.length > 0 && (
          <section className="search-results">
            <div className="search-results-header">
              <div>
                <h2>Results</h2>

                <p>
                  Showing results for "
                  {query.trim()}"
                </p>
              </div>

              <span>
                {searchResults.length}{" "}
                {searchResults.length === 1
                  ? "track"
                  : "tracks"}{" "}
                found
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