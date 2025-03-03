import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/LogIn/Login";
import Signup from "./components/auth/SignUp/SignUp";
import UserDashboard from "./pages/Dashboard/Userdashboard";
import Payment from "./pages/PaymentGateway/payment"; // Import Payment component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root path to login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/payment" element={<Payment />} /> {/* Add Payment route */}
      </Routes>
    </Router>
  );
}

export default App;