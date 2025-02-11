import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/LogIn/Login";
import Signup from "./components/auth/SignUp/SignUp";
import UserDashboard from "./pages/Dashboard/Userdashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;