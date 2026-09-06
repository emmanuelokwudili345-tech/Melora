import { createContext } from "react";
import type { MusicTrack } from "../types/music";

export interface PlayerContextValue {
  currentTrack: MusicTrack | null;
  setCurrentTrack: (track: MusicTrack) => void;
}

export const PlayerContext = createContext<
  PlayerContextValue | undefined
>(undefined);