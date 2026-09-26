import { useEffect, useState } from "react";
import {
  Clock3,
  Heart,
  ListMusic,
  LogOut,
  Mail,
  Music,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/useAuth";
import { useLikedTracks } from "../../context/useLikedTracks";
import { usePlaylist } from "../../context/usePlaylist";
import { getRecentlyPlayed } from "../../services/recentlyPlayed";
import "./ProfilePage.css";

export function ProfilePage() {
  const { user } = useAuth();
  const { likedTracks } = useLikedTracks();
  const {
    playlists,
    isLoading: isLoadingPlaylists,
  } = usePlaylist();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);
  const [recentlyPlayedCount, setRecentlyPlayedCount] =
    useState(0);
  const [isLoadingStats, setIsLoadingStats] =
    useState(true);

  const name =
    user?.user_metadata?.name || "Melora User";
  const email = user?.email || "";
  const initial = name.charAt(0).toUpperCase();
  const memberSince = user?.created_at
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(new Date(user.created_at))
    : "recently";

  useEffect(() => {
    async function loadProfileStats() {
      if (!user) {
        setRecentlyPlayedCount(0);
        setIsLoadingStats(false);
        return;
      }

      try {
        setIsLoadingStats(true);
        const tracks = await getRecentlyPlayed();
        setRecentlyPlayedCount(tracks.length);
      } catch (error) {
        console.error(
          "Failed to load profile stats:",
          error,
        );
        setRecentlyPlayedCount(0);
      } finally {
        setIsLoadingStats(false);
      }
    }

    loadProfileStats();
  }, [user]);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      navigate("/auth", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to log out:",
        error,
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">
          {initial}
        </div>

        <div className="profile-info">
          <span>YOUR PROFILE</span>
          <h1>{name}</h1>
          <p>{email}</p>
          <small>Member since {memberSince}</small>
        </div>
      </section>

      <section className="profile-stats">
        <div className="profile-stat">
          <Heart size={20} />
          <div>
            <strong>{likedTracks.length}</strong>
            <span>Liked Songs</span>
          </div>
        </div>

        <div className="profile-stat">
          <ListMusic size={20} />
          <div>
            <strong>
              {isLoadingPlaylists
                ? "..."
                : playlists.length}
            </strong>
            <span>Playlists</span>
          </div>
        </div>

        <div className="profile-stat">
          <Clock3 size={20} />
          <div>
            <strong>
              {isLoadingStats ? "..." : recentlyPlayedCount}
            </strong>
            <span>Recently Played</span>
          </div>
        </div>

        <div className="profile-stat">
          <Sparkles size={20} />
          <div>
            <strong>Melora</strong>
            <span>Premium Member</span>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Account information</h2>
          <p>Your Melora account details.</p>
        </div>

        <div className="profile-account">
          <div className="profile-detail">
            <div className="profile-detail-icon">
              <User size={18} />
            </div>

            <div>
              <span>Name</span>
              <p>{name}</p>
            </div>
          </div>

          <div className="profile-detail">
            <div className="profile-detail-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>Email</span>
              <p>{email}</p>
            </div>
          </div>

          <div className="profile-detail">
            <div className="profile-detail-icon">
              <Music size={18} />
            </div>

            <div>
              <span>Library status</span>
              <p>
                {likedTracks.length} liked songs and {playlists.length} playlists
              </p>
            </div>
          </div>

          <div className="profile-detail">
            <div className="profile-detail-icon">
              <Clock3 size={18} />
            </div>

            <div>
              <span>Listening activity</span>
              <p>
                {isLoadingStats
                  ? "Loading recent tracks..."
                  : `${recentlyPlayedCount} tracks recently played`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Account actions</h2>
          <p>Manage your Melora session.</p>
        </div>

        <div className="profile-actions">
          <button
            type="button"
            className="profile-secondary"
            onClick={() => navigate("/library")}
          >
            Browse library
          </button>

          <button
            type="button"
            className="profile-secondary"
            onClick={() => navigate("/liked")}
          >
            View liked songs
          </button>

          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={18} />

            <span>
              {isLoggingOut
                ? "Logging out..."
                : "Log out"}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}