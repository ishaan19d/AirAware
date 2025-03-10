import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreeUserDashboard.css';
import logo from '../../assets/logo.png';

const FreeUserDashboard = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState("Rajpath Area, Delhi");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [airQualityData, setAirQualityData] = useState({
        aqi: 0,
        category: "",
        primaryPollutant: "",
        precaution: "",
        pollutants: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch air quality data when component mounts or location changes
    useEffect(() => {
        fetchAirQualityData(location);
    }, []);

    const fetchAirQualityData = async (searchLocation) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/air-quality', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: searchLocation }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch air quality data');
            }
            
            const data = await response.json();
            setAirQualityData(data);
        } catch (error) {
            console.error('Error fetching air quality data:', error);
            setError('Failed to load air quality data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        fetchAirQualityData(location);
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

    // Function to handle subscription button click
    const handleSubscribeClick = () => {
        navigate('/payment');
    };

    // Function to determine color based on air quality category
    const getQualityColor = (category) => {
        if (!category) return '#92d050'; // Default color if category is undefined
        
        switch (category.toLowerCase()) {
            case 'good':
                return '#00e400'; // Bright green
            case 'satisfactory':
                return '#92d050'; // Light green
            case 'moderate':
                return '#ffff00'; // Yellow
            case 'poor':
                return '#ff7e00'; // Orange
            case 'very poor':
                return '#ff0000'; // Red
            case 'severe':
                return '#7030a0'; // Purple
            default:
                return '#92d050'; // Default to light green
        }
    };

    
    const getPollutantFullName = (name) => {
        switch (name) {
            case "PM2.5":
                return "Particulate matter less than 2.5 microns";
            case "PM10":
                return "Particulate matter less than 10 microns";
            case "CO":
                return "Carbon Monoxide";
            case "NO2":
                return "Nitrogen Dioxide";
            case "O3":
                return "Ozone";
            case "SO2":
                return "Sulphur Dioxide";
            default:
                return name;
        }
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
                        placeholder="Search City or Postcode"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <button type="submit" className="search-button">
                        <i className="search-icon">🔍</i>
                    </button>
                </form>
                <div className="profile-container">
                    <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
                        <span className="profile-icon">👤</span>
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

            {/* Main content with grid layout */}
            <div className="dashboard-content">
                {/* Today's Air Quality Box */}
                <div className="air-quality-box">
                    <div className="air-quality-header">
                        <h2>Today's Air Quality - {location}</h2>
                    </div>
                    {loading ? (
                        <div className="loading-message">Loading air quality data...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <div className="air-quality-content">
                            <div className="air-quality-indicator">
                                <div 
                                    className="circular-progress" 
                                    style={{ 
                                        background: `conic-gradient(${getQualityColor(airQualityData.category)} ${(airQualityData.aqi || 0) * 3.6}deg, #ededed 0deg)`
                                    }}
                                >
                                    <div className="aqi-value">{airQualityData.aqi || 0}</div>
                                </div>
                                <div className="aqi-details">
                                    <h3 className="aqi-category">{airQualityData.category || 'N/A'}</h3>
                                    <p className="aqi-precaution">{airQualityData.precaution || 'No precaution data available.'}</p>
                                </div>
                            </div>
                            <div className="primary-pollutant">
                                <h3>Primary Pollutant:</h3>
                                <p>{airQualityData.primaryPollutant || 'No primary pollutant data available.'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Subscribe Box */}
                <div className="subscribe-box">
                    <h2>Need More Features?</h2>
                    <button className="subscribe-button" onClick={handleSubscribeClick}>Subscribe Now</button>
                </div>
            </div>

            {/* All Pollutants Box */}
            <div className="all-pollutants-box">
                <div className="all-pollutants-header">
                    <h2>All Pollutants</h2>
                </div>
                {loading ? (
                    <div className="loading-message">Loading pollutants data...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : airQualityData.pollutants && airQualityData.pollutants.length > 0 ? (
                    <div className="pollutants-grid">
                        {airQualityData.pollutants.map((pollutant, index) => (
                            <div key={index} className="pollutant-item">
                                <div className="pollutant-header">
                                    <h3>{pollutant.name} ({getPollutantFullName(pollutant.name)})</h3>
                                </div>
                                <div className="pollutant-content">
                                    <div 
                                        className="pollutant-indicator" 
                                        style={{ 
                                            background: `conic-gradient(${getQualityColor(pollutant.category)} ${(pollutant.value || 0) * 3.6}deg, #ededed 0deg)`
                                        }}
                                    >
                                        <div className="pollutant-value">{pollutant.value || 0}</div>
                                    </div>
                                    <div className="pollutant-details">
                                        <p className="pollutant-category">{pollutant.category || 'N/A'}</p>
                                        <p className="pollutant-unit">{pollutant.unit || 'µg/m³'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data-message">No pollutants data available.</div>
                )}
            </div>

            {showLogoutDialog && (
                <div className="logout-dialog">
                    <p>Are you sure you want to logout?</p>
                    <button className="confirm-button" onClick={confirmLogout}>Yes</button>
                    <button className="cancel-button" onClick={cancelLogout}>No</button>
                </div>
            )}
        </div>
    );
};

export default FreeUserDashboard;