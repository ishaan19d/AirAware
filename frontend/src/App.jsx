import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/landingPage";
import Login from "./components/auth/LogIn/Login";
import Signup from "./components/auth/SignUp/SignUp";
import Payment from "./pages/PaymentGateway/payment";
import FreeUserDashboard from "./pages/FreeUserDashboard/FreeUserDashboard"; 
// import PremiumUserDashboard from "./pages/PremiumUserDashboard/PremiumUserDashboard";
// import PollutantDashboard from './pages/PollutantDashboard/PollutantDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/free-dashboard" element={<FreeUserDashboard />} />
        {/* <Route path="/premium-dashboard" element={<PremiumUserDashboard />} />
        <Route path="/pollutant-dashboard" element={<PollutantDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;