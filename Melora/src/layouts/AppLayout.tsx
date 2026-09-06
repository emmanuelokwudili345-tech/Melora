import { MusicPlayer } from "../components/MusicPlayer";
import { Outlet } from "react-router";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";
import "./AppLayout.css";

export function AppLayout() {
  return (
    <div className="app-layout">
      <SideBar />

      <div className="app-content">
        <NavBar />

        <main className="page-content">
          <Outlet />
        </main>

        <MusicPlayer />
      </div>
    </div>
  );
}