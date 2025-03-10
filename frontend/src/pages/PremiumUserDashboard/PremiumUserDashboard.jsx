import React, { useState, useEffect } from 'react';
import { FaBell, FaUser, FaSearch, FaRunning, FaWind, FaComment, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PremiumUserDashboard.css';

const PremiumUserDashboard = () => {
  const navigate = useNavigate();
  
  const [airQualityData, setAirQualityData] = useState({
    aqi: 45,
    category: 'Good',
    primaryPollutant: 'PM2.5',
    precaution: 'Air quality is considered satisfactory, and air pollution poses little or no risk.'
  });
  
  const [pollutants, setPollutants] = useState([
    { name: 'PM2.5', value: 12.5, unit: 'μg/m³', category: 'Good' },
    { name: 'PM10', value: 25.3, unit: 'μg/m³', category: 'Good' },
    { name: 'O3', value: 35.1, unit: 'ppb', category: 'Good' },
    { name: 'NO2', value: 15.2, unit: 'ppb', category: 'Good' },
    { name: 'SO2', value: 2.1, unit: 'ppb', category: 'Good' },
    { name: 'CO', value: 0.5, unit: 'ppm', category: 'Good' }
  ]);
  
  const [healthRecommendations, setHealthRecommendations] = useState({
    title: 'Ideal for Outdoor Activities',
    description: 'The air quality is good and poses little or no risk to health.',
    recommendations: [
      'Enjoy outdoor activities',
      'Open windows to bring in fresh air',
      'Perfect time for exercise and sports'
    ]
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Air quality has improved in your area', time: '2 hours ago', read: false },
    { id: 2, message: 'New health recommendation available', time: '1 day ago', read: true }
  ]);
  
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I\'m your AirAware assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Fetch air quality data
  useEffect(() => {
    // Replace with actual API call
    const fetchAirQualityData = async () => {
      try {
        // const response = await axios.get('your-api-endpoint');
        // setAirQualityData(response.data);
        
        // Using mock data for now
        console.log('Fetching air quality data...');
      } catch (error) {
        console.error('Error fetching air quality data:', error);
      }
    };
    
    fetchAirQualityData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement search functionality
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
  };

  const confirmLogout = () => {
    console.log('Logging out...');
    // Implement logout functionality
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'I\'m processing your question about air quality. I\'ll have an answer for you shortly.' 
      }]);
    }, 1000);
    
    setChatInput('');
  };
  
  const goToPollutantDashboard = () => {
    navigate('/pollutant-dashboard');
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-title">
          <div className="logo-circle">AA</div>
          <div>
            <h1 className="dashboard-title">AirAware</h1>
           
          </div>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
        
        <div className="header-actions">
          <div className="notification-container">
            <button className="notification-button" onClick={toggleNotifications}>
              <FaBell className="notification-icon" />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="mark-read-button" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <p className="notification-message">{notification.message}</p>
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
              <FaUser className="profile-icon" />
            </button>
            
            {showProfileMenu && (
              <div className="dropdown-menu">
                <p><strong>John Doe</strong></p>
                <p>john.doe@example.com</p>
                <div className="subscription-status">Premium User</div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="dashboard-content">
        <section className="air-quality-box">
          <div className="air-quality-header">
            <h2>Current Air Quality</h2>
          </div>
          
          <div className="air-quality-content">
            <div className="air-quality-indicator">
              <div className={`circular-progress aqi-${airQualityData.category.toLowerCase().replace(' ', '-')}`}>
                <span className="aqi-value">{airQualityData.aqi}</span>
              </div>
              
              <div className="aqi-details">
                <h3 className="aqi-category">{airQualityData.category}</h3>
                <p className="aqi-precaution">{airQualityData.precaution}</p>
              </div>
            </div>
            
            <div className="primary-pollutant">
              <h3>Primary Pollutant</h3>
              <p>{airQualityData.primaryPollutant}</p>
            </div>
          </div>
        </section>
        
        <section className="health-activities-box">
          <div className="health-activities-header">
            <h2>Health & Activities</h2>
          </div>
          
          <div className="health-activities-content">
            <div className="health-icon">
              <FaRunning />
            </div>
            
            <div className="health-details">
              <h3>{healthRecommendations.title}</h3>
              <p>{healthRecommendations.description}</p>
              
              <ul className="health-recommendations">
                {healthRecommendations.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
              
              <button className="pollutant-link" onClick={goToPollutantDashboard}>
                View Pollutant Details <FaArrowRight />
              </button>
            </div>
          </div>
        </section>
        
        <section className="all-pollutants-box">
          <div className="all-pollutants-header">
            <h2>All Pollutants</h2>
          </div>
          
          <div className="pollutants-grid">
            {pollutants.map((pollutant, index) => (
              <div key={index} className="pollutant-item">
                <div className="pollutant-header">
                  <h3>{pollutant.name}</h3>
                </div>
                
                <div className="pollutant-content">
                  <div className={`pollutant-indicator aqi-${pollutant.category.toLowerCase().replace(' ', '-')}`}>
                    <span className="pollutant-value">{pollutant.value}</span>
                  </div>
                  
                  <div className="pollutant-details">
                    <h3 className="pollutant-category">{pollutant.category}</h3>
                    <p className="pollutant-unit">{pollutant.unit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        {showChatbot ? <FaTimes /> : <FaComment />}
      </button>
      
      <div className={`chatbot-container ${!showChatbot ? 'hidden' : ''}`}>
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
              <button className="confirm-button" onClick={confirmLogout}>Yes</button>
              <button className="cancel-button" onClick={cancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumUserDashboard;