import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/useAuth";
import "./AuthPage.css";

type AuthMode = "login" | "signup";
type ToastType = "success" | "error";

interface Toast {
  type: ToastType;
  message: string;
}

export function AuthPage() {
  const [mode, setMode] =
    useState<AuthMode>("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [toast, setToast] =
    useState<Toast | null>(null);

  const { user, isLoading: isAuthLoading } =
    useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/profile", {
        replace: true,
      });
    }
  }, [user, isAuthLoading, navigate]);

  const isSignup = mode === "signup";

  function showToast(
    type: ToastType,
    message: string,
  ) {
    setToast({
      type,
      message,
    });
  }

  function handleModeChange() {
    setMode((currentMode) =>
      currentMode === "login"
        ? "signup"
        : "login",
    );

    setToast(null);
    setPassword("");
    setShowPassword(false);
  }

  function getAuthErrorMessage(
    message: string,
  ) {
    const normalizedMessage =
      message.toLowerCase();

    if (
      normalizedMessage.includes(
        "invalid login credentials",
      )
    ) {
      return "The email or password is incorrect.";
    }

    if (
      normalizedMessage.includes(
        "user already registered",
      )
    ) {
      return "An account with this email already exists.";
    }

    if (
      normalizedMessage.includes(
        "email not confirmed",
      )
    ) {
      return "Please confirm your email before logging in.";
    }

    if (
      normalizedMessage.includes(
        "password should be at least",
      )
    ) {
      return "Your password is too short.";
    }

    if (
      normalizedMessage.includes(
        "unable to validate email address",
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      normalizedMessage.includes(
        "rate limit",
      )
    ) {
      return "Too many attempts. Please wait a moment and try again.";
    }

    return "Something went wrong. Please try again.";
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    setToast(null);

    if (!trimmedEmail) {
      showToast(
        "error",
        "Please enter your email address.",
      );
      return;
    }

    if (!password) {
      showToast(
        "error",
        "Please enter your password.",
      );
      return;
    }

    if (isSignup && !trimmedName) {
      showToast(
        "error",
        "Please enter your name.",
      );
      return;
    }

    if (isSignup && password.length < 6) {
      showToast(
        "error",
        "Your password must be at least 6 characters.",
      );
      return;
    }

    try {
      setIsLoading(true);

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

        showToast(
          "success",
          "Account created successfully. Check your email to confirm your account.",
        );

        setPassword("");
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
        showToast(
          "error",
          getAuthErrorMessage(error.message),
        );
        return;
      }

      showToast(
        "error",
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
      {toast && (
        <div
          className={`auth-toast auth-toast-${toast.type}`}
          role="status"
        >
          <span className="auth-toast-icon">
            {toast.type === "success"
              ? "✓"
              : "!"}
          </span>

          <p>{toast.message}</p>
        </div>
      )}

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

            <div className="auth-password">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
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

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (visible) => !visible,
                  )
                }
                disabled={isLoading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </label>

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