import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/useAuth";
import "./AuthPage.css";

type AuthMode = "login" | "signup";

export function AuthPage() {
  const [mode, setMode] =
    useState<AuthMode>("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const { user, isLoading: isAuthLoading } =
    useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/profile", {
        replace: true,
      });
    }
  }, [user, isAuthLoading, navigate]);

  const isSignup = mode === "signup";

  function handleModeChange() {
    setMode((currentMode) =>
      currentMode === "login"
        ? "signup"
        : "login",
    );

    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage(
        "Please fill in all required fields.",
      );
      return;
    }

    if (isSignup && !trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      if (isSignup) {
        const {
          data,
          error,
        } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              name: trimmedName,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          navigate("/");
          return;
        }

        setSuccessMessage(
          "Account created. Check your email to confirm your account.",
        );

        return;
      }

      const { error } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

      if (error) {
        throw error;
      }

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthLoading || user) {
    return null;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">M</span>
          <span>Melora</span>
        </div>

        <div className="auth-header">
          <h1>
            {isSignup
              ? "Create your account"
              : "Welcome back"}
          </h1>

          <p>
            {isSignup
              ? "Join Melora and start discovering music."
              : "Log in to continue listening to your music."}
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {isSignup && (
            <label>
              Name

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
                disabled={isLoading}
              />
            </label>
          )}

          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isLoading}
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete={
                isSignup
                  ? "new-password"
                  : "current-password"
              }
              disabled={isLoading}
            />
          </label>

          {errorMessage && (
            <p
              className="auth-message auth-error"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="auth-message auth-success">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading
              ? isSignup
                ? "Creating account..."
                : "Logging in..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={handleModeChange}
            disabled={isLoading}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </section>
    </main>
  );
}