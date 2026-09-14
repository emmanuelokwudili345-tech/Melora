import { useState } from "react";
import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import { useLikedTracks } from "../context/useLikedTracks";
import type { MusicTrack } from "../types/music";
import "./MusicCard.css";

interface MusicCardProps {
  track: MusicTrack;
  onClick: () => void;
}

export function MusicCard({
  track,
  onClick,
}: MusicCardProps) {
  const [isLikeLoading, setIsLikeLoading] =
    useState(false);

  const {
    isTrackLiked,
    likeTrack,
    unlikeTrack,
  } = useLikedTracks();

  const isLiked = isTrackLiked(track.id);

  const artwork =
    track.artwork?._480x480 ??
    track.artwork?._150x150;

  async function handleLikeClick(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    if (isLikeLoading) {
      return;
    }

    setIsLikeLoading(true);

    try {
      if (isLiked) {
        await unlikeTrack(track.id);
      } else {
        await likeTrack(track);
      }
    } catch (error) {
      console.error(
        "Failed to update liked track:",
        error,
      );
    } finally {
      setIsLikeLoading(false);
    }
  }

  return (
    <article
      className="music-card"
      onClick={onClick}
    >
      <div className="music-card-artwork">
        {artwork && (
          <img
            src={artwork}
            alt={`${track.title} artwork`}
          />
        )}

        <button
          type="button"
          className={`music-card-like ${
            isLiked ? "music-card-like-active" : ""
          }`}
          onClick={handleLikeClick}
          disabled={isLikeLoading}
          aria-label={
            isLiked
              ? `Unlike ${track.title}`
              : `Like ${track.title}`
          }
        >
          <Heart
            size={18}
            fill={isLiked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <h3>{track.title}</h3>

      <p>{track.user.name}</p>
    </article>
  );
}