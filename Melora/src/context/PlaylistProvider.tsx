import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  addTrackToPlaylist as addTrackToPlaylistService,
  createPlaylist as createPlaylistService,
  deletePlaylist as deletePlaylistService,
  getPlaylistTracks as getPlaylistTracksService,
  getPlaylists,
  isTrackInPlaylist as isTrackInPlaylistService,
  removeTrackFromPlaylist as removeTrackFromPlaylistService,
  type Playlist,
  type PlaylistTrack,
} from "../services/playlists";
import type { MusicTrack } from "../types/music";
import { PlaylistContext } from "./PlaylistContext";
import { useAuth } from "./useAuth";

interface PlaylistProviderProps {
  children: ReactNode;
}

export function PlaylistProvider({
  children,
}: PlaylistProviderProps) {
  const { user } = useAuth();

  const [playlists, setPlaylists] = useState<
    Playlist[]
  >([]);
  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadPlaylists() {
      try {
        setIsLoading(true);

        const data = await getPlaylists();
        setPlaylists(data);
      } catch (error) {
        console.error(
          "Failed to load playlists:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaylists();
  }, [user]);

  async function createPlaylist(
    name: string,
  ): Promise<Playlist> {
    const playlist =
      await createPlaylistService(name);

    setPlaylists((currentPlaylists) => [
      ...currentPlaylists,
      playlist,
    ]);

    return playlist;
  }

  async function addTrackToPlaylist(
    playlistId: string,
    track: MusicTrack,
  ): Promise<void> {
    await addTrackToPlaylistService(
      playlistId,
      track,
    );
  }

  async function removeTrackFromPlaylist(
    playlistId: string,
    trackId: string,
  ): Promise<void> {
    await removeTrackFromPlaylistService(
      playlistId,
      trackId,
    );
  }

  async function deletePlaylist(
    playlistId: string,
  ): Promise<void> {
    await deletePlaylistService(playlistId);

    setPlaylists((currentPlaylists) =>
      currentPlaylists.filter(
        (playlist) =>
          playlist.id !== playlistId,
      ),
    );
  }

  async function getPlaylistTracks(
    playlistId: string,
  ): Promise<PlaylistTrack[]> {
    return getPlaylistTracksService(
      playlistId,
    );
  }

  async function isTrackInPlaylist(
    playlistId: string,
    trackId: string,
  ): Promise<boolean> {
    return isTrackInPlaylistService(
      playlistId,
      trackId,
    );
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        isLoading,
        createPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        deletePlaylist,
        getPlaylistTracks,
        isTrackInPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}