import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import Notification from "./pages/Notification.tsx";
import Profile from "./pages/Profile.tsx";
import Setting from "./pages/Setting.tsx";
import Groups from "./pages/Groups.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
