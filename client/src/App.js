import Login from "./pages/Login.tsx"
import SignUp from "./pages/SignUp.tsx"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>  
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
