import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { AuthPage } from "./pages/Auth/AuthPage";
import { HomePage } from "./pages/Home/HomePage";
import { SearchPage } from "./pages/Search/SearchPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<AuthPage />}
        />

        <Route
          element={<AppLayout />}
        >
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
            element={<div>Library</div>}
          />

          <Route
            path="/liked"
            element={<div>Liked Songs</div>}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;