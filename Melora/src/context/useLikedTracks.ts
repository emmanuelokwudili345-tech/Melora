import { useContext } from "react";
import { LikedTracksContext } from "./LikedTracksContext";

export function useLikedTracks() {
  const context = useContext(LikedTracksContext);

  if (!context) {
    throw new Error(
      "useLikedTracks must be used inside LikedTracksProvider",
    );
  }

  return context;
}