import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import Notification from "./pages/Notification.tsx";
import Profile from "./pages/Profile.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext.js";
import ProtectedRoute from "./utils/ProtectedRoute.js";
import Settings from "./pages/Settings.tsx";

function App() {
  // const { user } = useAuthContext();

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthPage={true}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute isAuthPage={true}>
                <SignUp />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
