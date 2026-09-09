import { useState } from "react";
import { Outlet } from "react-router";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";
import { MusicPlayer } from "../components/MusicPlayer";
import "./AppLayout.css";

export function AppLayout() {
  const [isSideBarOpen, setIsSideBarOpen] =
    useState(false);

  function handleMenuClick() {
    setIsSideBarOpen(true);
  }

  function handleSideBarClose() {
    setIsSideBarOpen(false);
  }

  return (
    <div className="app-layout">
      <SideBar
        isOpen={isSideBarOpen}
        onClose={handleSideBarClose}
      />

      <div className="app-content">
        <NavBar
          onMenuClick={handleMenuClick}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <MusicPlayer />
    </div>
  );
}