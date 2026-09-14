import {
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  getLikedTracks,
  likeTrack as saveLikedTrack,
  unlikeTrack as removeLikedTrack,
} from "../services/likedTracks";
import type { MusicTrack } from "../types/music";
import { LikedTracksContext } from "./LikedTracksContext";

interface LikedTracksProviderProps {
  children: ReactNode;
}

export function LikedTracksProvider({
  children,
}: LikedTracksProviderProps) {
  const [likedTracks, setLikedTracks] =
    useState<MusicTrack[]>([]);

  const [likedTrackIds, setLikedTrackIds] =
    useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadLikedTracks() {
      try {
        const tracks = await getLikedTracks();

        setLikedTracks(tracks);
        setLikedTrackIds(
          new Set(tracks.map((track) => track.id)),
        );
      } catch (error) {
        console.error(
          "Failed to load liked tracks:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadLikedTracks();
  }, []);

  function isTrackLiked(trackId: string) {
    return likedTrackIds.has(trackId);
  }

  async function likeTrack(track: MusicTrack) {
    await saveLikedTrack(track);

    setLikedTracks((currentTracks) => [
      track,
      ...currentTracks,
    ]);

    setLikedTrackIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(track.id);
      return nextIds;
    });
  }

  async function unlikeTrack(trackId: string) {
    await removeLikedTrack(trackId);

    setLikedTracks((currentTracks) =>
      currentTracks.filter(
        (track) => track.id !== trackId,
      ),
    );

    setLikedTrackIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(trackId);
      return nextIds;
    });
  }

  return (
    <LikedTracksContext.Provider
      value={{
        likedTracks,
        likedTrackIds,
        isLoading,
        isTrackLiked,
        likeTrack,
        unlikeTrack,
      }}
    >
      {children}
    </LikedTracksContext.Provider>
  );
}