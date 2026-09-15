import { supabase } from "../lib/supabase";
import type { MusicTrack } from "../types/music";

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  track_data: MusicTrack;
  created_at: string;
}

export async function getPlaylists(): Promise<Playlist[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createPlaylist(
  name: string,
): Promise<Playlist> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be logged in to create a playlist.",
    );
  }

  const { data, error } = await supabase
    .from("playlists")
    .insert({
      user_id: user.id,
      name: name.trim(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getPlaylistById(
  playlistId: string,
): Promise<Playlist | null> {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlistId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getPlaylistTracks(
  playlistId: string,
): Promise<PlaylistTrack[]> {
  const { data, error } = await supabase
    .from("playlist_tracks")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    ...item,
    track_data: item.track_data as MusicTrack,
  }));
}

export async function addTrackToPlaylist(
  playlistId: string,
  track: MusicTrack,
): Promise<void> {
  const { error } = await supabase
    .from("playlist_tracks")
    .insert({
      playlist_id: playlistId,
      track_id: track.id,
      track_data: track,
    });

  if (error) {
    throw error;
  }
}

export async function removeTrackFromPlaylist(
  playlistId: string,
  trackId: string,
): Promise<void> {
  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId);

  if (error) {
    throw error;
  }
}

export async function deletePlaylist(
  playlistId: string,
): Promise<void> {
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);

  if (error) {
    throw error;
  }
}

export async function isTrackInPlaylist(
  playlistId: string,
  trackId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("playlist_tracks")
    .select("id")
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}

export async function getPlaylistIdForTrack(
  trackId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("playlist_tracks")
    .select("playlist_id")
    .eq("track_id", trackId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.playlist_id ?? null;
}