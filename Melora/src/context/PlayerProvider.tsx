import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { MusicTrack } from "../types/music";
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

  const [queue, setQueue] =
    useState<MusicTrack[]>([]);

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

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentTrack || !audioRef.current) {
      return;
    }

    const audio = audioRef.current;

    setCurrentTime(0);
    setDuration(0);

    audio.load();

    async function startPlaying() {
      try {
        await audio.play();
      } catch (error) {
        console.error(
          "Failed to play track:",
          error,
        );
      }
    }

    startPlaying();
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
  }, [volume]);

  function handleTrackChange(track: MusicTrack) {
    const trackIndex = queue.findIndex(
      (queueTrack) => queueTrack.id === track.id,
    );

    setCurrentTrack(track);
    setCurrentTrackIndex(trackIndex);
  }

  function handleQueueChange(tracks: MusicTrack[]) {
    setQueue(tracks);
  }

  async function play() {
    try {
      await audioRef.current?.play();
    } catch (error) {
      console.error(
        "Failed to play track:",
        error,
      );
    }
  }

  function pause() {
    audioRef.current?.pause();
  }

  function seek(time: number) {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function setVolume(volumeValue: number) {
    setVolumeState(volumeValue);
  }

  function nextTrack() {
    if (queue.length === 0) {
      return;
    }

    const nextIndex =
      currentTrackIndex + 1;

    if (nextIndex < queue.length) {
      setCurrentTrack(queue[nextIndex]);
      setCurrentTrackIndex(nextIndex);

      return;
    }

    if (repeatMode === "all") {
      setCurrentTrack(queue[0]);
      setCurrentTrackIndex(0);
    }
  }

  function previousTrack() {
    if (queue.length === 0) {
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
  }

  function toggleRepeatMode() {
    setRepeatMode((currentMode) => {
      if (currentMode === "off") {
        return "all";
      }

      if (currentMode === "all") {
        return "one";
      }

      return "off";
    });
  }

  function handleTimeUpdate() {
    if (!audioRef.current) {
      return;
    }

    setCurrentTime(
      audioRef.current.currentTime,
    );
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) {
      return;
    }

    setDuration(
      audioRef.current.duration,
    );
  }

  async function handleTrackEnded() {
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

    nextTrack();
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        repeatMode,

        setCurrentTrack: handleTrackChange,
        setQueue: handleQueueChange,

        play,
        pause,
        seek,
        setVolume,

        nextTrack,
        previousTrack,

        toggleRepeatMode,
      }}
    >
      <audio
        ref={audioRef}
        src={currentTrack?.stream?.url}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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