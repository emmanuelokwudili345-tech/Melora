import { createContext } from "react";
import type { MusicTrack } from "../types/music";

export type RepeatMode = "off" | "all" | "one";

export interface PlayerContextValue {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;

  setCurrentTrack: (track: MusicTrack) => void;
  setQueue: (tracks: MusicTrack[]) => void;

  play: () => void;
  pause: () => void;
  seek: (time: number) => void;

  setVolume: (volume: number) => void;

  nextTrack: () => void;
  previousTrack: () => void;

  toggleRepeatMode: () => void;
}

export const PlayerContext = createContext<
  PlayerContextValue | undefined
>(undefined);