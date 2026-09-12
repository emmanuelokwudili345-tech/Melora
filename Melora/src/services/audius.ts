import type { MusicTrack } from "../types/music";

declare global {
  interface Window {
    audiusSdk: (config: {
      apiKey: string;
    }) => {
      tracks: {
        getTrendingTracks: (params?: {
          limit?: number;
          offset?: number;
          time?: "week" | "month" | "year" | "allTime";
        }) => Promise<{
          data?: MusicTrack[];
        }>;

        searchTracks: (params: {
          query?: string;
          limit?: number;
          offset?: number;
          sortMethod?:
            | "relevant"
            | "popular"
            | "recent";
        }) => Promise<{
          data?: MusicTrack[];
        }>;
      };
    };
  }
}

const apiKey = import.meta.env.VITE_AUDIUS_API_KEY;

if (!apiKey) {
  throw new Error("Audius API key is missing.");
}

const audiusSdk = window.audiusSdk({
  apiKey,
});

export async function getTrendingTracks(): Promise<
  MusicTrack[]
> {
  const { data } =
    await audiusSdk.tracks.getTrendingTracks({
      limit: 10,
    });

  return data ?? [];
}

export async function getNewReleases(): Promise<
  MusicTrack[]
> {
  const { data } =
    await audiusSdk.tracks.searchTracks({
      limit: 10,
      sortMethod: "recent",
    });

  return data ?? [];
}

export async function searchTracks(
  query: string,
): Promise<MusicTrack[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const { data } =
    await audiusSdk.tracks.searchTracks({
      query: trimmedQuery,
      limit: 20,
      sortMethod: "relevant",
    });

  return data ?? [];
}