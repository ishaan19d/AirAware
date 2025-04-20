import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Navbar.css';

const LandingNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-name">
          <img src={logo} alt="AirAware Logo" className="logo" />
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 transition-all">
            AirAware
          </Link>
        </div>

        <button className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#home" className="nav-link">Home</a>
          <a href="#about-us" className="nav-link">About Us</a>
          <a href="#subscriptions" className="nav-link">Subscriptions</a>
          <a href="#contact-us" className="nav-link">Contact Us</a>
          <Link to="/login" className="nav-link">Login/Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
