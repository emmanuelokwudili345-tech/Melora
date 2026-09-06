import { useState } from "react";
import type { ReactNode } from "react";
import type { MusicTrack } from "../types/music";
import { PlayerContext } from "./PlayerContext";

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}