import { createContext } from "react";
import type { MusicTrack } from "../types/music";

export interface LikedTracksContextValue {
  likedTracks: MusicTrack[];
  likedTrackIds: Set<string>;
  isLoading: boolean;
  isTrackLiked: (trackId: string) => boolean;
  likeTrack: (track: MusicTrack) => Promise<void>;
  unlikeTrack: (trackId: string) => Promise<void>;
}

export const LikedTracksContext =
  createContext<LikedTracksContextValue | undefined>(
    undefined,
  );