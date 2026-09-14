import { useState } from "react";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/useAuth";
import "./ProfilePage.css";

export function ProfilePage() {
  const { user } = useAuth();
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
      <section className="profile-header">
        <div className="profile-avatar">
          {initial}
        </div>

        <div className="profile-info">
          <h1>{name}</h1>
          <p>{email}</p>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Account</h2>
        </div>

        <div className="profile-account">
          <div>
            <span>Name</span>
            <p>{name}</p>
          </div>

          <div>
            <span>Email</span>
            <p>{email}</p>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Account actions</h2>
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