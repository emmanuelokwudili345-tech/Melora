import { createContext } from "react";
import type { Playlist, PlaylistTrack } from "../services/playlists";
import type { MusicTrack } from "../types/music";

export interface PlaylistContextValue {
  playlists: Playlist[];
  isLoading: boolean;
  createPlaylist: (
    name: string,
  ) => Promise<Playlist>;
  addTrackToPlaylist: (
    playlistId: string,
    track: MusicTrack,
  ) => Promise<void>;
  removeTrackFromPlaylist: (
    playlistId: string,
    trackId: string,
  ) => Promise<void>;
  deletePlaylist: (
    playlistId: string,
  ) => Promise<void>;
  getPlaylistTracks: (
    playlistId: string,
  ) => Promise<PlaylistTrack[]>;
  isTrackInPlaylist: (
    playlistId: string,
    trackId: string,
  ) => Promise<boolean>;
}

export const PlaylistContext =
  createContext<PlaylistContextValue | null>(
    null,
  );