import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { PlayerProvider } from "./context/PlayerProvider";
import { LikedTracksProvider} from './context/LikedTracksProvider'
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
    <LikedTracksProvider>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </LikedTracksProvider>
</AuthProvider>
  </StrictMode>,
);