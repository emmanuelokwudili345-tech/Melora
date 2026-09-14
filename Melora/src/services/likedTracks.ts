import { supabase } from "../lib/supabase";
import type { MusicTrack } from "../types/music";

export async function getLikedTracks(): Promise<MusicTrack[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("liked_tracks")
    .select("track_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((item) => item.track_data as MusicTrack);
}

export async function likeTrack(
  track: MusicTrack,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to like a track.");
  }

  const { error } = await supabase
    .from("liked_tracks")
    .insert({
      user_id: user.id,
      track_id: track.id,
      track_data: track,
    });

  if (error) {
    throw error;
  }
}

export async function unlikeTrack(
  trackId: string,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to unlike a track.");
  }

  const { error } = await supabase
    .from("liked_tracks")
    .delete()
    .eq("user_id", user.id)
    .eq("track_id", trackId);

  if (error) {
    throw error;
  }
}

export async function isTrackLiked(
  trackId: string,
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from("liked_tracks")
    .select("id")
    .eq("user_id", user.id)
    .eq("track_id", trackId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}