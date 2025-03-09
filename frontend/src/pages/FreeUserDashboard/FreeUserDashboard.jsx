import React, { useState } from 'react';
import './FreeUserDashboard.css';
import logo from '../../assets/logo.png'; // Import the logo

const FreeUserDashboard = () => {
    const [location, setLocation] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        // Send the location to the backend
        try {
            const response = await fetch('http://localhost:8080/search-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location }),
            });
            const data = await response.json();
            console.log(data); // Handle the response data
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => {
        setShowLogoutDialog(false);
        // Perform logout logic here
        window.location.href = '/'; // Redirect to landing page
    };

    const cancelLogout = () => {
        setShowLogoutDialog(false);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="logo-title">
                    <img src={logo} alt="AirAware Logo" className="dashboard-logo" />
                    <h1 className="dashboard-title">AirAware</h1>
                </div>
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search city or postcode"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
                <div className="profile-container">
                    <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
                        <span className="profile-icon">👤</span> {/* Generic profile icon */}
                    </button>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <p>Username: user123</p>
                            <p>Email: user@example.com</p>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
            {showLogoutDialog && (
                <div className="logout-dialog">
                    <p>Are you sure you want to logout?</p>
                    <button className="confirm-button" onClick={confirmLogout}>Yes</button>
                    <button className="cancel-button" onClick={cancelLogout}>No</button>
                </div>
            )}
            <h1>Welcome</h1>
        </div>
    );
};

export default FreeUserDashboard;