import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaUser,
  FaRunning,
  FaWind,
  FaComment,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./PremiumUserDashboard.css";

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

const PremiumUserDashboard = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Detecting your location...");

  const [airQualityData, setAirQualityData] = useState({
    aqi: 0,
    category: "",
    primaryPollutant: "",
    precaution: "",
    pollutants: [],
  });

  const [healthRecommendations, setHealthRecommendations] = useState({
    title: "Loading recommendations...",
    description: "Please wait while we analyze the air quality data.",
    recommendations: [],
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Air quality has improved in your area",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "New health recommendation available",
      time: "1 day ago",
      read: true,
    },
  ]);

  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AirAware assistant. How can I help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("aqi");
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [showDiseaseDropdown, setShowDiseaseDropdown] = useState(false);

  // Available metrics for the graph
  const availableMetrics = [
    { value: "aqi", label: "Air Quality Index" },
    { value: "co", label: "Carbon Monoxide (CO)" },
    { value: "no2", label: "Nitrogen Dioxide (NO₂)" },
    { value: "o3", label: "Ozone (O₃)" },
    { value: "pm2_5", label: "PM2.5" },
    { value: "pm10", label: "PM10" },
    { value: "so2", label: "Sulphur Dioxide (SO₂)" },
  ];
  const diseases = [
    "Allergic Rhinitis",
    "Sinusitis",
    "Pharyngitis",
    "Laryngitis",
    "Tonsillitis",
    "Otitis Media",
    "Otitis Externa",
    "Eustachian Tube Dysfunction",
    "Nasal Polyps",
    "Nose Bleeds",
    "Hay Fever",
    "Vocal Cord Dysfunction",
    "Asthma",
    "COPD",
    "Chronic Bronchitis",
    "Emphysema",
    "Pneumonia",
    "Bronchiectasis",
    "Pulmonary Fibrosis",
    "Lung Cancer",
    "Respiratory Infections",
    "Bronchiolitis",
    "Pleurisy",
    "Tuberculosis",
    "Pulmonary Edema",
    "Interstitial Lung Disease",
    "Sarcoidosis",
    "Cystic Fibrosis",
    "Sleep Apnea",
    "Hypersensitivity Pneumonitis",
    "Occupational Asthma",
    "Silicosis",
    "Asbestosis",
    "Byssinosis",
    "Coal Worker's Pneumoconiosis",
    "Farmer's Lung",
    "Vertigo",
    "Tinnitus",
    "Meniere's Disease",
    "Deviated Septum Complications",
    "Adenoid Hypertrophy",
    "Dysphagia",
    "Smell Disorders",
    "Taste Disorders",
    "Voice Disorders",
    "Salivary Gland Disorders",
    "Oral Mucosal Lesions",
    "Temporomandibular Joint Disorders",
    "Geographic Tongue",
    "Burning Mouth Syndrome",
  ];
  const handleDiseaseChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedDiseases(value);
  };

  useEffect(() => {
    // Check authentication and get user data from token
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode the JWT token to get user information
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);

      // Extract user data from token subject or claims
      const userInfo = {
        name: decodedToken.name || decodedToken.sub || "User",
        email: decodedToken.email || decodedToken.sub || "user@example.com",
      };

      console.log("Extracted user info:", userInfo);
      setUserData(userInfo);
    } catch (error) {
      console.error("Error decoding token:", error);
      // If token can't be decoded, try to get user data from localStorage as fallback
      const storedUserData = localStorage.getItem("userData");
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

            const city =
              geoData.address.city ||
              geoData.address.town ||
              geoData.address.village ||
              geoData.address.county ||
              "";
            const state = geoData.address.state || "";
            const detectedLocation = `${city}${
              city && state ? ", " : ""
            }${state}`;

            setLocation(detectedLocation || "Your current location");
            fetchAirQualityData(latitude, longitude);

            // If we have a city and state, fetch time-series data for the graph
            if (city && state) {
              fetchTimeSeriesData(city, state);
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            setError("Failed to detect location. Please try again.");
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
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
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost/api/air-quality/location?city=${encodeURIComponent(
          city
        )}&state=${encodeURIComponent(state)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch time series data");

      const data = await response.json();
      console.log("Time series data:", data);

      // Process and transform data for the chart
      const processedData = processTimeSeriesData(data);
      setGraphData(processedData);
    } catch (error) {
      console.error("Time series fetch error:", error);
      setGraphError("Failed to load historical data. Please try again.");
    } finally {
      setGraphLoading(false);
    }
  };

  // Process and transform time-series data for the chart
  const processTimeSeriesData = (data) => {
    // Assuming data is an array of readings with timestamp, aqi, and pollutant values
    const timestamps = data.map((item) => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    // Extract metrics (AQI and pollutants)
    const metrics = {};
    availableMetrics.forEach((metric) => {
      metrics[metric.value] = data.map((item) => {
        if (metric.value === "aqi") return item.aqi;
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
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost/api/air-quality/fetch?lat=${lat}&lon=${lon}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch air quality data");

      const data = await response.json();

      // Transform the API response to match your frontend structure
      const transformedData = transformAirQualityData(data);
      setAirQualityData(transformedData);

      // Generate health recommendations based on air quality
      generateHealthRecommendations(transformedData.category);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load air quality data. Please try again.");
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
      category: getPollutantCategory(key, value),
    }));

    // Generate precaution based on AQI
    const precaution = getPrecautionMessage(category);

    return {
      aqi,
      category,
      primaryPollutant: getPollutantDisplayName(primaryPollutant.toLowerCase()),
      precaution,
      pollutants,
    };
  };

  const generateHealthRecommendations = (category) => {
    let recommendations = {};

    switch (category.toLowerCase()) {
      case "good":
        recommendations = {
          title: "Ideal for Outdoor Activities",
          description:
            "The air quality is good and poses little or no risk to health.",
          recommendations: [
            "Enjoy outdoor activities",
            "Open windows to bring in fresh air",
            "Perfect time for exercise and sports",
          ],
        };
        break;

      case "satisfactory":
        recommendations = {
          title: "Good for Most Activities",
          description:
            "Air quality is acceptable; however, unusually sensitive people should consider reducing prolonged outdoor exertion.",
          recommendations: [
            "Most people can enjoy outdoor activities",
            "Sensitive individuals should monitor their condition",
            "Good time for moderate exercise",
          ],
        };
        break;

      case "moderate":
        recommendations = {
          title: "Be Mindful of Symptoms",
          description:
            "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
          recommendations: [
            "Children and elderly should limit prolonged outdoor exertion",
            "Keep windows closed during peak traffic hours",
            "People with respiratory or heart conditions should reduce outdoor activity",
          ],
        };
        break;

      case "poor":
        recommendations = {
          title: "Limit Outdoor Activities",
          description:
            "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
          recommendations: [
            "Avoid prolonged or heavy exertion outdoors",
            "Use air purifiers indoors",
            "Wear masks when going outside if you have respiratory issues",
          ],
        };
        break;

      case "very poor":
        recommendations = {
          title: "Avoid Outdoor Activities",
          description:
            "Health alert: everyone may experience more serious health effects.",
          recommendations: [
            "Stay indoors and keep activity levels low",
            "Use air purifiers",
            "Keep all windows and doors closed",
            "Wear N95 masks if you must go outside",
          ],
        };
        break;

      case "severe":
        recommendations = {
          title: "Health Emergency",
          description:
            "Health warning of emergency conditions: the entire population is more likely to be affected.",
          recommendations: [
            "Avoid all outdoor physical activities",
            "Stay indoors with air purifiers running",
            "Seek medical help if experiencing breathing difficulties",
            "Use N95/N99 masks if you must go outdoors",
          ],
        };
        break;

      default:
        recommendations = {
          title: "Loading recommendations...",
          description: "Please wait while we analyze the air quality data.",
          recommendations: [],
        };
    }

    setHealthRecommendations(recommendations);
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
      nh3: "NH₃",
    };
    return names[key] || key;
  };

  const getPollutantCategory = (key, value) => {
    // Apply the specified ranges for each pollutant
    switch (key) {
      case "co":
        if (value <= 1000) return "Good";
        if (value <= 2000) return "Moderate";
        return "Poor";
      case "no":
      case "no2":
        if (value <= 40) return "Good";
        if (value <= 80) return "Moderate";
        return "Poor";
      case "pm10":
        if (value <= 50) return "Good";
        if (value <= 100) return "Moderate";
        return "Poor";
      case "so2":
        if (value <= 40) return "Good";
        if (value <= 80) return "Moderate";
        return "Poor";
      case "o3":
        if (value <= 50) return "Good";
        if (value <= 100) return "Moderate";
        return "Poor";
      case "pm2_5":
        if (value <= 30) return "Good";
        if (value <= 60) return "Moderate";
        return "Poor";
      default:
        if (value < 50) return "Good";
        if (value < 100) return "Moderate";
        return "Poor";
    }
  };

  const getPollutantFullName = (name) => {
    const fullNames = {
      "PM2.5": "Particulate matter less than 2.5 microns",
      PM10: "Particulate matter less than 10 microns",
      CO: "Carbon Monoxide",
      NO: "Nitric Oxide",
      "NO₂": "Nitrogen Dioxide",
      "O₃": "Ozone",
      "SO₂": "Sulphur Dioxide",
      "NH₃": "Ammonia",
    };
    return fullNames[name] || name;
  };

  const getPrecautionMessage = (category) => {
    switch (category.toLowerCase()) {
      case "good":
        return "Air quality is satisfactory. Enjoy your normal activities.";
      case "satisfactory":
        return "Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.";
      case "moderate":
        return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
      case "poor":
        return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
      case "very poor":
        return "Health alert: everyone may experience more serious health effects.";
      case "severe":
        return "Health warning of emergency conditions: the entire population is more likely to be affected.";
      default:
        return "No precaution data available.";
    }
  };

  const getQualityColor = (category) => {
    if (!category) return "#92d050";
    switch (category.toLowerCase()) {
      case "good":
        return "#00e400";
      case "satisfactory":
        return "#92d050";
      case "moderate":
        return "#ffdd00";
      case "poor":
        return "#ff7e00";
      case "very poor":
        return "#ff0000";
      case "severe":
        return "#7030a0";
      default:
        return "#92d050";
    }
  };

  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  const getChartData = () => {
    if (!graphData) return null;

    const metricData = graphData.metrics[selectedMetric] || [];
    const selectedMetricInfo = availableMetrics.find(
      (m) => m.value === selectedMetric
    );

    return {
      labels: graphData.timestamps,
      datasets: [
        {
          label: selectedMetricInfo?.label || selectedMetric.toUpperCase(),
          data: metricData,
          borderColor:
            selectedMetric === "aqi"
              ? getQualityColor(airQualityData.category)
              : "#36a2eb",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
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
        position: "top",
      },
      title: {
        display: true,
        text: "Air Quality Time Series",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text:
            selectedMetric === "aqi" ? "AQI Value" : "Concentration (µg/m³)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };
  // Handle checkbox selection
  const handleDiseaseCheckboxChange = (e, disease) => {
    if (e.target.checked) {
      setSelectedDiseases([...selectedDiseases, disease]);
    } else {
      setSelectedDiseases(selectedDiseases.filter((d) => d !== disease));
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setShowLogoutDialog(false);
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { sender: "user", text: chatInput }]);

    // Simulate bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm processing your question about air quality. I'll have an answer for you shortly.",
        },
      ]);
    }, 1000);

    setChatInput("");
  };

  const goToPollutantDashboard = () => {
    navigate("/pollutant-dashboard");
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-title">
          <div className="logo-circle">AA</div>
          <div>
            <h1 className="dashboard-title">AirAware Premium</h1>
          </div>
        </div>

        <div className="header-actions">
          <div className="notification-container">
            <button
              className="notification-button"
              onClick={toggleNotifications}
            >
              <FaBell className="notification-icon" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      className="mark-read-button"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.read ? "unread" : ""
                        }`}
                      >
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <p className="notification-time">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="profile-container">
            <button className="profile-button" onClick={toggleProfileMenu}>
              <span className="profile-icon">
                {userData?.email
                  ? userData.email.charAt(0).toUpperCase()
                  : "👤"}
              </span>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu">
                {userData ? (
                  <>
                    <p>
                      <strong>{userData.name || "Premium User"}</strong>
                    </p>
                    <p>{userData.email || "user@example.com"}</p>
                    <div className="subscription-status">Premium User</div>
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
      </header>

      <main className="dashboard-content">
        <section className="air-quality-box">
          <div className="air-quality-header">
            <h2>Current Air Quality - {location}</h2>
          </div>

          {loading ? (
            <div className="loading-message">Loading air quality data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="air-quality-content">
              <div className="air-quality-indicator">
                <div
                  className="quality-indicator-light"
                  style={{
                    backgroundColor: getQualityColor(airQualityData.category),
                    boxShadow: `0 0 20px ${getQualityColor(
                      airQualityData.category
                    )}`,
                  }}
                >
                  <div className="aqi-value">{airQualityData.aqi || 0}</div>
                </div>

                <div className="aqi-details">
                  <h3 className="aqi-category">
                    {airQualityData.category || "N/A"}
                  </h3>
                  <p className="aqi-precaution">{airQualityData.precaution}</p>
                </div>
              </div>

              <div className="primary-pollutant">
                <h3>Primary Pollutant</h3>
                <p>
                  {airQualityData.primaryPollutant ||
                    "No primary pollutant data available."}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="health-activities-box">
          <div className="health-activities-header">
            <h2>Health & Activities</h2>
          </div>

          {loading ? (
            <div className="loading-message">
              Loading health recommendations...
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="health-activities-content">
              <div className="health-icon">
                <FaRunning />
              </div>

              <div className="health-details">
                <h3>{healthRecommendations.title}</h3>
                <p>{healthRecommendations.description}</p>

                {healthRecommendations.recommendations.length > 0 && (
                  <ul className="health-recommendations">
                    {healthRecommendations.recommendations.map(
                      (recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      )
                    )}
                  </ul>
                )}

                <button
                  className="pollutant-link"
                  onClick={goToPollutantDashboard}
                >
                  View Detailed Health Effects <FaArrowRight />
                </button>
              </div>
            </div>
          )}
        </section>
        <section className="disease-selection-box">
          <div className="disease-selection-header">
            <h2>Select Diseases</h2>
          </div>
          <div className="disease-selection-content">
            <div className="dropdown-container">
              <button
                className="dropdown-button"
                onClick={() => setShowDiseaseDropdown(!showDiseaseDropdown)}
              >
                {selectedDiseases.length > 0
                  ? `Selected (${selectedDiseases.length})`
                  : "Choose Diseases"}
              </button>
              {showDiseaseDropdown && (
                <div className="dropdown-menu">
                  {diseases.map((disease, index) => (
                    <div key={index} className="dropdown-item">
                      <input
                        type="checkbox"
                        id={`disease-${index}`}
                        value={disease}
                        checked={selectedDiseases.includes(disease)}
                        onChange={(e) =>
                          handleDiseaseCheckboxChange(e, disease)
                        }
                      />
                      <label htmlFor={`disease-${index}`}>{disease}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="selected-diseases">
              Selected Diseases:{" "}
              {selectedDiseases.length > 0
                ? selectedDiseases.join(", ")
                : "None"}
            </p>
          </div>
        </section>
        {/* Time Series Graph Box */}
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
                {availableMetrics.map((metric) => (
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
            <div className="no-data-message">
              No historical data available for this location.
            </div>
          )}
        </div>

        <section className="all-pollutants-box">
          <div className="all-pollutants-header">
            <h2>All Pollutants</h2>
          </div>

          {loading ? (
            <div className="loading-message">Loading pollutants data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : airQualityData.pollutants &&
            airQualityData.pollutants.length > 0 ? (
            <div className="pollutants-grid">
              {airQualityData.pollutants.map((pollutant, index) => (
                <div key={index} className="pollutant-item">
                  <div className="pollutant-header">
                    <h3>{pollutant.name}</h3>
                    <div
                      className="quality-dot"
                      style={{
                        backgroundColor: getQualityColor(pollutant.category),
                        boxShadow: `0 0 5px ${getQualityColor(
                          pollutant.category
                        )}`,
                      }}
                      title={`${pollutant.category}: ${pollutant.value.toFixed(
                        1
                      )} ${pollutant.unit}`}
                    ></div>
                  </div>

                  <div className="pollutant-content">
                    <div className="pollutant-details">
                      <div className="pollutant-value-container">
                        <span className="pollutant-value">
                          {pollutant.value.toFixed(1)}
                        </span>
                        <span className="pollutant-unit">{pollutant.unit}</span>
                      </div>
                      <p className="pollutant-category">{pollutant.category}</p>
                    </div>

                    <div className="quality-bar">
                      <div
                        className="quality-fill"
                        style={{
                          width:
                            pollutant.category.toLowerCase() === "good"
                              ? "33%"
                              : pollutant.category.toLowerCase() === "moderate"
                              ? "66%"
                              : "100%",
                          backgroundColor: getQualityColor(pollutant.category),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-message">No pollutants data available.</div>
          )}
        </section>
      </main>

      <button className="chatbot-toggle" onClick={toggleChatbot}>
        {showChatbot ? <FaTimes /> : <FaComment />}
      </button>

      <div className={`chatbot-container ${!showChatbot ? "hidden" : ""}`}>
        <div className="chatbot-header">
          <h3>AirAware Assistant</h3>
          <button className="chatbot-close" onClick={toggleChatbot}>
            <FaTimes />
          </button>
        </div>

        <div className="chatbot-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <form className="chatbot-input-form" onSubmit={handleChatSubmit}>
          <input
            type="text"
            placeholder="Type your question..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>

      {showLogoutDialog && (
        <div className="logout-dialog">
          <div className="logout-dialog-content">
            <p>Are you sure you want to logout?</p>
            <div className="logout-dialog-buttons">
              <button className="confirm-button" onClick={confirmLogout}>
                Yes
              </button>
              <button className="cancel-button" onClick={cancelLogout}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumUserDashboard;
