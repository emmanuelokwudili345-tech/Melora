import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <div>
      <aside>
        Sidebar
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}