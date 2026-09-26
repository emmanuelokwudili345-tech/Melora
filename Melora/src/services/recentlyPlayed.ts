import { supabase } from "../lib/supabase";
import type { MusicTrack } from "../types/music";

export interface RecentlyPlayedTrack {
  id: string;
  user_id: string;
  track_id: string;
  track_data: MusicTrack;
  played_at: string;
}

export async function addRecentlyPlayed(
  track: MusicTrack,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("recently_played")
    .upsert(
      {
        user_id: user.id,
        track_id: track.id,
        track_data: track,
        played_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,track_id",
      },
    );

  if (error) {
    throw error;
  }
}

export async function getRecentlyPlayed(): Promise<
  RecentlyPlayedTrack[]
> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("recently_played")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    ...item,
    track_data: item.track_data as MusicTrack,
  }));
}