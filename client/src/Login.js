import Login from "./components/login.tsx"
import Signup from "./components/signup.tsx"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>  
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
