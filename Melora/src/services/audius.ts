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

export async function getTrendingTracks(): Promise<MusicTrack[]> {
  const { data } = await audiusSdk.tracks.getTrendingTracks({
    limit: 10,
  });

  return data ?? [];
}