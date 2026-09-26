import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { MusicTrack } from "../types/music";
import { addRecentlyPlayed } from "../services/recentlyPlayed";
import {
  PlayerContext,
  type RepeatMode,
} from "./PlayerContext";

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({
  children,
}: PlayerProviderProps) {
  const [currentTrack, setCurrentTrack] =
    useState<MusicTrack | null>(null);

  const [queue, setQueue] = useState<MusicTrack[]>([]);

  const [currentTrackIndex, setCurrentTrackIndex] =
    useState(-1);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolumeState] =
    useState(0.7);

  const [repeatMode, setRepeatMode] =
    useState<RepeatMode>("off");

  const [isShuffleEnabled, setIsShuffleEnabled] =
    useState(false);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const recentlyPlayedTrackId =
    useRef<string | null>(null);

  useEffect(() => {
    if (!currentTrack || !audioRef.current) {
      return;
    }

    setCurrentTime(0);
    setDuration(0);
    recentlyPlayedTrackId.current = null;
  }, [currentTrack]);

  const handleTrackChange = useCallback(
    (track: MusicTrack) => {
      const trackIndex = queue.findIndex(
        (queueTrack) =>
          queueTrack.id === track.id,
      );

      setCurrentTrack(track);
      setCurrentTrackIndex(trackIndex);
    },
    [queue],
  );

  const handleQueueChange = useCallback(
    (tracks: MusicTrack[]) => {
      setQueue(tracks);

      if (
        !currentTrack &&
        tracks.length > 0
      ) {
        setCurrentTrackIndex(-1);
      }
    },
    [currentTrack],
  );

  const play = useCallback(async () => {
    try {
      await audioRef.current?.play();
    } catch (error) {
      console.error(
        "Failed to play track:",
        error,
      );
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback(
    (volumeValue: number) => {
      if (!audioRef.current) {
        return;
      }

      audioRef.current.volume =
        volumeValue;

      setVolumeState(volumeValue);
    },
    [],
  );

  const getRandomTrackIndex = useCallback(() => {
    if (queue.length <= 1) {
      return currentTrackIndex;
    }

    let randomIndex = Math.floor(
      Math.random() * queue.length,
    );

    while (
      randomIndex === currentTrackIndex
    ) {
      randomIndex = Math.floor(
        Math.random() * queue.length,
      );
    }

    return randomIndex;
  }, [queue, currentTrackIndex]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) {
      return;
    }

    if (isShuffleEnabled) {
      const randomIndex =
        getRandomTrackIndex();

      if (randomIndex >= 0) {
        setCurrentTrack(
          queue[randomIndex],
        );
        setCurrentTrackIndex(
          randomIndex,
        );
      }

      return;
    }

    const nextIndex =
      currentTrackIndex + 1;

    if (nextIndex < queue.length) {
      setCurrentTrack(
        queue[nextIndex],
      );
      setCurrentTrackIndex(
        nextIndex,
      );

      return;
    }

    if (repeatMode === "all") {
      setCurrentTrack(queue[0]);
      setCurrentTrackIndex(0);
    }
  }, [
    queue,
    currentTrackIndex,
    isShuffleEnabled,
    repeatMode,
    getRandomTrackIndex,
  ]);

  const previousTrack = useCallback(() => {
    if (queue.length === 0) {
      return;
    }

    if (isShuffleEnabled) {
      const randomIndex =
        getRandomTrackIndex();

      if (randomIndex >= 0) {
        setCurrentTrack(
          queue[randomIndex],
        );
        setCurrentTrackIndex(
          randomIndex,
        );
      }

      return;
    }

    const previousIndex =
      currentTrackIndex - 1;

    if (previousIndex >= 0) {
      setCurrentTrack(
        queue[previousIndex],
      );
      setCurrentTrackIndex(
        previousIndex,
      );
    }
  }, [
    queue,
    currentTrackIndex,
    isShuffleEnabled,
    getRandomTrackIndex,
  ]);

  const toggleRepeatMode = useCallback(() => {
    setRepeatMode((currentMode) => {
      if (currentMode === "off") {
        return "all";
      }

      if (currentMode === "all") {
        return "one";
      }

      return "off";
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffleEnabled(
      (isEnabled) => !isEnabled,
    );
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    setCurrentTime(
      audioRef.current.currentTime,
    );
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    setDuration(
      audioRef.current.duration,
    );
  }, []);

  const handleCanPlay = useCallback(async () => {
    try {
      await audioRef.current?.play();
    } catch (error) {
      console.error(
        "Failed to automatically play track:",
        error,
      );
    }
  }, []);

  const handleTrackEnded = useCallback(async () => {
    if (!audioRef.current) {
      return;
    }

    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;

      try {
        await audioRef.current.play();
      } catch (error) {
        console.error(
          "Failed to repeat track:",
          error,
        );
      }

      return;
    }

    if (queue.length === 0) {
      return;
    }

    nextTrack();
  }, [queue.length, nextTrack, repeatMode]);

  const handlePlay = useCallback(async () => {
    setIsPlaying(true);

    if (
      !currentTrack ||
      recentlyPlayedTrackId.current ===
        currentTrack.id
    ) {
      return;
    }

    recentlyPlayedTrackId.current =
      currentTrack.id;

    try {
      await addRecentlyPlayed(
        currentTrack,
      );
    } catch (error) {
      console.error(
        "Failed to save recently played track:",
        error,
      );
    }
  }, [currentTrack]);

  const contextValue = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,

      repeatMode,
      isShuffleEnabled,

      setCurrentTrack:
        handleTrackChange,
      setQueue: handleQueueChange,

      play,
      pause,
      seek,
      setVolume,

      nextTrack,
      previousTrack,

      toggleRepeatMode,
      toggleShuffle,
    }),
    [
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      repeatMode,
      isShuffleEnabled,
      handleTrackChange,
      handleQueueChange,
      play,
      pause,
      seek,
      setVolume,
      nextTrack,
      previousTrack,
      toggleRepeatMode,
      toggleShuffle,
    ],
  );

  return (
    <PlayerContext.Provider
      value={contextValue}
    >
      <audio
        ref={audioRef}
        src={currentTrack?.stream?.url}
        preload="auto"
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onPause={() =>
          setIsPlaying(false)
        }
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onEnded={handleTrackEnded}
      />

      {children}
    </PlayerContext.Provider>
  );
}