import type { MusicTrack } from "../types/music";

declare global {
  interface Window {
    audiusSdk: (config: {
      apiKey: string;
    }) => {
      tracks: {
        getTrack: (params: {
          trackId: string;
        }) => Promise<{
          data?: MusicTrack;
        }>;

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
        userId?: string;
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

export async function getTrackById(
  trackId: string,
): Promise<MusicTrack | null> {
  const { data } =
    await audiusSdk.tracks.getTrack({
      trackId,
    });

  return data ?? null;
}

export async function getTracksByUserId(
  userId: string,
): Promise<MusicTrack[]> {
  const { data } =
    await audiusSdk.tracks.searchTracks({
      userId,
      limit: 20,
      sortMethod: "popular",
    });

  return data ?? [];
}