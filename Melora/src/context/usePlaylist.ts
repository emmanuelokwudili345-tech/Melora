import { useContext } from "react";
import { PlaylistContext } from "./PlaylistContext";

export function usePlaylist() {
  const context = useContext(
    PlaylistContext,
  );

  if (!context) {
    throw new Error(
      "usePlaylist must be used inside PlaylistProvider.",
    );
  }

  return context;
}