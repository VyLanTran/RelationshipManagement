import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import Notification from "./pages/Notification.tsx";
import Profile from "./pages/Profile.tsx";
import Groups from "./pages/Groups.tsx";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext.js";
import ProtectedRoute from "./utils/ProtectedRoute.js";
import Settings from "./pages/Settings.tsx";
import Navbar from "./components/navbar/Navbar.tsx";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
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
        </Routes>

        <div className="flex flex-row justify-center">
          <Navbar />
          <div className="pt-[60px]">
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
        </div>
      </div>
    </Router>
  );
}

export default App;
