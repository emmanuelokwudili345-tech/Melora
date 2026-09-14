import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { AuthPage } from "./pages/Auth/AuthPage";
import { HomePage } from "./pages/Home/HomePage";
import { SearchPage } from "./pages/Search/SearchPage";
import { LibraryPage } from "./pages/Library/LibraryPage";
import { LikedPage } from "./pages/Liked/LikedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<AuthPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={<HomePage />}
            />

            <Route
              path="/search"
              element={<SearchPage />}
            />

            <Route
              path="/library"
              element={<LibraryPage />}
            />

            <Route
              path="/liked"
              element={<LikedPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;