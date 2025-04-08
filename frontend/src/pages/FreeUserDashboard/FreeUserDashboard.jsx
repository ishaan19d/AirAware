import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreeUserDashboard.css';
import logo from '../../assets/logo.png';
import { jwtDecode } from "jwt-decode"; // Make sure to install with: npm install jwt-decode
import { Line } from 'react-chartjs-2'; // Make sure to install with: npm install react-chartjs-2 chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FreeUserDashboard = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState("Detecting your location...");
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
    const [userData, setUserData] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [graphLoading, setGraphLoading] = useState(false);
    const [graphError, setGraphError] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState('aqi');
    
    // Available metrics for the graph
    const availableMetrics = [
        { value: 'aqi', label: 'Air Quality Index' },
        { value: 'co', label: 'Carbon Monoxide (CO)' },
        { value: 'no2', label: 'Nitrogen Dioxide (NO₂)' },
        { value: 'o3', label: 'Ozone (O₃)' },
        { value: 'pm2_5', label: 'PM2.5' },
        { value: 'pm10', label: 'PM10' },
        { value: 'so2', label: 'Sulphur Dioxide (SO₂)' }
    ];

    useEffect(() => {
        // Check authentication and get user data from token
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Decode the JWT token to get user information
            const decodedToken = jwtDecode(token);
            console.log("Decoded token:", decodedToken);
            
            // Extract user data from token subject or claims
            const userInfo = {
                name: decodedToken.name || decodedToken.sub || 'User',
                email: decodedToken.email || decodedToken.sub || 'user@example.com'
            };
            
            console.log("Extracted user info:", userInfo);
            setUserData(userInfo);
        } catch (error) {
            console.error("Error decoding token:", error);
            // If token can't be decoded, try to get user data from localStorage as fallback
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                try {
                    const parsedUserData = JSON.parse(storedUserData);
                    console.log("Fallback: using stored user data:", parsedUserData);
                    setUserData(parsedUserData);
                } catch (parseError) {
                    console.error("Error parsing stored user data:", parseError);
                    setUserData(null);
                }
            } else {
                console.log("No user data available");
                setUserData(null);
            }
        }

        // Location detection code
        const detectLocation = async () => {
            if (!navigator.geolocation) {
                setError("Geolocation is not supported by your browser");
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        
                        const reverseGeocodeResponse = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const geoData = await reverseGeocodeResponse.json();
                        
                        const city = geoData.address.city || geoData.address.town || 
                                  geoData.address.village || geoData.address.county || '';
                        const state = geoData.address.state || '';
                        const detectedLocation = `${city}${city && state ? ', ' : ''}${state}`;
                        
                        setLocation(detectedLocation || "Your current location");
                        fetchAirQualityData(latitude, longitude);
                        
                        // If we have a city and state, fetch time-series data for the graph
                        if (city && state) {
                            fetchTimeSeriesData(city, state);
                        }
                    } catch (error) {
                        console.error('Geocoding error:', error);
                        setError("Failed to detect location. Please try again.");
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError("Please enable location access to view air quality data");
                    setLoading(false);
                }
            );
        };

        detectLocation();
    }, [navigate]);

    // Fetch time-series data for the graph
    const fetchTimeSeriesData = async (city, state) => {
        setGraphLoading(true);
        setGraphError(null);
        
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost/api/air-quality/location?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch time series data');
            
            const data = await response.json();
            console.log("Time series data:", data);
            
            // Process and transform data for the chart
            const processedData = processTimeSeriesData(data);
            setGraphData(processedData);
        } catch (error) {
            console.error('Time series fetch error:', error);
            setGraphError('Failed to load historical data. Please try again.');
        } finally {
            setGraphLoading(false);
        }
    };

    // Process and transform time-series data for the chart
    const processTimeSeriesData = (data) => {
        // Assuming data is an array of readings with timestamp, aqi, and pollutant values
        const timestamps = data.map(item => {
            const date = new Date(item.timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
        
        // Extract metrics (AQI and pollutants)
        const metrics = {};
        availableMetrics.forEach(metric => {
            metrics[metric.value] = data.map(item => {
                if (metric.value === 'aqi') return item.aqi;
                return item.components?.[metric.value] || 0;
            });
        });
        
        return { timestamps, metrics };
    };

    const fetchAirQualityData = async (lat, lon) => {
        setLoading(true);
        setError(null);
        console.log(`Fetching air quality data for coordinates: ${lat}, ${lon}`);
        
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost/api/air-quality/fetch?lat=${lat}&lon=${lon}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch air quality data');
            
            const data = await response.json();
            
            // Transform the API response to match your frontend structure
            const transformedData = transformAirQualityData(data);
            setAirQualityData(transformedData);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load air quality data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const transformAirQualityData = (apiData) => {
        // Determine AQI category
        const aqi = apiData.aqi;
        let category = "";
        if (aqi <= 50) category = "Good";
        else if (aqi <= 100) category = "Satisfactory";
        else if (aqi <= 200) category = "Moderate";
        else if (aqi <= 300) category = "Poor";
        else if (aqi <= 400) category = "Very Poor";
        else category = "Severe";

        // Determine primary pollutant
        const components = apiData.components;
        let primaryPollutant = "";
        let maxValue = 0;
        for (const [key, value] of Object.entries(components)) {
            if (value > maxValue) {
                maxValue = value;
                primaryPollutant = key.toUpperCase();
            }
        }

        // Create pollutants array for display
        const pollutants = Object.entries(components).map(([key, value]) => ({
            name: getPollutantDisplayName(key),
            value: value,
            unit: "µg/m³",
            category: getPollutantCategory(key, value)
        }));

        // Generate precaution based on AQI
        const precaution = getPrecautionMessage(category);

        return {
            aqi,
            category,
            primaryPollutant,
            precaution,
            pollutants
        };
    };

    const getPollutantDisplayName = (key) => {
        const names = {
            co: "CO",
            no: "NO",
            no2: "NO₂",
            o3: "O₃",
            so2: "SO₂",
            pm2_5: "PM2.5",
            pm10: "PM10",
            nh3: "NH₃"
        };
        return names[key] || key;
    };

    const getPollutantCategory = (key, value) => {
        if (value < 50) return "Good";
        if (value < 100) return "Moderate";
        return "Poor";
    };

    const getPrecautionMessage = (category) => {
        switch(category.toLowerCase()) {
            case 'good': return "Air quality is satisfactory. Enjoy your normal activities.";
            case 'satisfactory': return "Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.";
            case 'moderate': return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
            case 'poor': return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
            case 'very poor': return "Health alert: everyone may experience more serious health effects.";
            case 'severe': return "Health warning of emergency conditions: the entire population is more likely to be affected.";
            default: return "No precaution data available.";
        }
    };

    const getQualityColor = (category) => {
        if (!category) return '#92d050';
        switch (category.toLowerCase()) {
            case 'good': return '#00e400';
            case 'satisfactory': return '#92d050';
            case 'moderate': return '#ffff00';
            case 'poor': return '#ff7e00';
            case 'very poor': return '#ff0000';
            case 'severe': return '#7030a0';
            default: return '#92d050';
        }
    };

    const getPollutantFullName = (name) => {
        const fullNames = {
            "PM2.5": "Particulate matter less than 2.5 microns",
            "PM10": "Particulate matter less than 10 microns",
            "CO": "Carbon Monoxide",
            "NO": "Nitric Oxide",
            "NO₂": "Nitrogen Dioxide",
            "O₃": "Ozone",
            "SO₂": "Sulphur Dioxide",
            "NH₃": "Ammonia"
        };
        return fullNames[name] || name;
    };

    const handleMetricChange = (e) => {
        setSelectedMetric(e.target.value);
    };

    const getChartData = () => {
        if (!graphData) return null;
        
        const metricData = graphData.metrics[selectedMetric] || [];
        const selectedMetricInfo = availableMetrics.find(m => m.value === selectedMetric);
        
        return {
            labels: graphData.timestamps,
            datasets: [
                {
                    label: selectedMetricInfo?.label || selectedMetric.toUpperCase(),
                    data: metricData,
                    borderColor: selectedMetric === 'aqi' ? getQualityColor(airQualityData.category) : '#36a2eb',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.4,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Air Quality Time Series',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: selectedMetric === 'aqi' ? 'AQI Value' : 'Concentration (µg/m³)',
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time',
                }
            }
        },
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => { 
        setShowLogoutDialog(false); 
        window.location.href = '/'; 
    };

    const cancelLogout = () => setShowLogoutDialog(false);
    const handleSubscribeClick = () => navigate('/payment');

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="logo-title">
                    <img src={logo} alt="AirAware Logo" className="dashboard-logo" />
                    <h1 className="dashboard-title">AirAware</h1>
                </div>
                
                <div className="header-actions">
                    <button className="subscribe-button" onClick={handleSubscribeClick}>
                        Subscribe Now
                    </button>
                    
                    <div className="profile-container">
                        <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
                            <span className="profile-icon">
                                {userData?.email ? userData.email.charAt(0).toUpperCase() : '👤'}
                            </span>
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                {userData ? (
                                    <>
                                        <p>Name: {userData.name || 'N/A'}</p>
                                        <p>Email: {userData.email || 'N/A'}</p>
                                        <button className="logout-button" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <p>Loading user data...</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="air-quality-box full-width">
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
                                    <p className="aqi-precaution">{airQualityData.precaution}</p>
                                </div>
                            </div>
                            <div className="primary-pollutant">
                                <h3>Primary Pollutant:</h3>
                                <p>{airQualityData.primaryPollutant || 'No primary pollutant data available.'}</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* New Time Series Graph Box */}
                <div className="graph-box full-width">
                    <div className="graph-header">
                        <h2>Air Quality Trends</h2>
                        <div className="metric-selector">
                            <label htmlFor="metric-select">Select metric:</label>
                            <select 
                                id="metric-select" 
                                value={selectedMetric} 
                                onChange={handleMetricChange}
                                className="metric-dropdown"
                            >
                                {availableMetrics.map(metric => (
                                    <option key={metric.value} value={metric.value}>
                                        {metric.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {graphLoading ? (
                        <div className="loading-message">Loading trend data...</div>
                    ) : graphError ? (
                        <div className="error-message">{graphError}</div>
                    ) : graphData ? (
                        <div className="graph-container">
                            <Line data={getChartData()} options={chartOptions} />
                        </div>
                    ) : (
                        <div className="no-data-message">No historical data available for this location.</div>
                    )}
                </div>
            </div>

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
                                        <div className="pollutant-value">{pollutant.value.toFixed(2)}</div>
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