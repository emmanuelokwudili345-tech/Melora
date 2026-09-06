import { PlayerProvider } from "./context/PlayerProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "./pages/Home/HomePage";
import { SearchPage } from "./pages/Search/SearchPage";
import { LibraryPage } from "./pages/Library/LibraryPage";
import { LikedPage } from "./pages/Liked/LikedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/liked" element={<LikedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;