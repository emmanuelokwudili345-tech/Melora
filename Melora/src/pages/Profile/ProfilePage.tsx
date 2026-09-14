import { useState } from "react";
import {
  Heart,
  LogOut,
  Mail,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/useAuth";
import { useLikedTracks } from "../../context/useLikedTracks";
import "./ProfilePage.css";

export function ProfilePage() {
  const { user } = useAuth();
  const { likedTracks } = useLikedTracks();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const name =
    user?.user_metadata?.name || "Melora User";

  const email = user?.email || "";

  const initial = name
    .charAt(0)
    .toUpperCase();

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
          <User size={20} />

          <div>
            <strong>Member</strong>
            <span>Melora Account</span>
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
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Account actions</h2>
          <p>Manage your Melora session.</p>
        </div>

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
      </section>
    </div>
  );
}