import React, { useState, useEffect } from 'react';
import { FaBell, FaUser, FaSearch, FaShower, FaMask, FaCloudSun, FaInfoCircle, FaWind, FaHome } from 'react-icons/fa';
import axios from 'axios';
import './PollutantDashboard.css';

const PollutantDashboard = () => {
  const [pollenData, setPollenData] = useState({
    treePollen: { today: 'Moderate', tomorrow: 'Moderate', thursday: 'Moderate' },
    grassPollen: { today: 'Moderate', tomorrow: 'Moderate', thursday: 'Moderate' },
    ragweedPollen: { today: 'None', tomorrow: 'None', thursday: 'None' }
  });
  
  const [selectedPollutant, setSelectedPollutant] = useState('treePollen');
  const [possibleDiseases, setPossibleDiseases] = useState([
    { name: 'Allergic Rhinitis', description: 'Inflammation of the nasal passages causing sneezing, congestion, and runny nose.' },
    { name: 'Asthma', description: 'Respiratory condition causing difficulty breathing, chest tightness, and coughing.' },
    { name: 'Conjunctivitis', description: 'Inflammation of the eye causing redness, itching, and watery discharge.' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'High pollen alert for your area', time: '2 hours ago', read: false },
    { id: 2, message: 'Air quality has improved', time: '1 day ago', read: true }
  ]);
  
  const [alertThresholds, setAlertThresholds] = useState({
    treePollen: 'Moderate',
    grassPollen: 'Moderate',
    ragweedPollen: 'Low'
  });

  // Fetch data from your trained model
  useEffect(() => {
    // Replace with actual API call to your trained model
    const fetchPollenData = async () => {
      try {
        // const response = await axios.get('your-api-endpoint');
        // setPollenData(response.data);
        
        // Using mock data for now
        console.log('Fetching pollen data...');
      } catch (error) {
        console.error('Error fetching pollen data:', error);
      }
    };
    
    fetchPollenData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement search functionality
  };

  const handlePollutantSelect = (pollutant) => {
    setSelectedPollutant(pollutant);
  };

  const handleSetAlert = (pollutant, level) => {
    setAlertThresholds({
      ...alertThresholds,
      [pollutant]: level
    });
    
    // Save to user preferences
    console.log(`Alert set for ${pollutant} at level ${level}`);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="pollutant-dashboard">
      <header className="dashboard-header">
        <div className="logo-title">
          <div className="logo-circle">AA</div>
          <h1 className="dashboard-title">AirAware</h1>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search pollutant"
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
                <button className="logout-button">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="pollutant-content">
        <section className="pollen-breakdown">
          <h2>Pollen Breakdown</h2>
          <p className="pollen-description">
            Daily pollen concentration levels of major respiratory allergens in the 3-day weather forecast
          </p>
          
          <div className="pollen-types">
            <div className={`pollen-type ${selectedPollutant === 'treePollen' ? 'selected' : ''}`} onClick={() => handlePollutantSelect('treePollen')}>
              <div className="pollen-icon tree-pollen"></div>
              <h3>Tree Pollen</h3>
              <ul className="pollen-levels">
                <li><span className="day">Today:</span> <span className="level">{pollenData.treePollen.today}</span></li>
                <li><span className="day">Tomorrow:</span> <span className="level">{pollenData.treePollen.tomorrow}</span></li>
                <li><span className="day">Thursday:</span> <span className="level">{pollenData.treePollen.thursday}</span></li>
              </ul>
            </div>
            
            <div className={`pollen-type ${selectedPollutant === 'grassPollen' ? 'selected' : ''}`} onClick={() => handlePollutantSelect('grassPollen')}>
              <div className="pollen-icon grass-pollen"></div>
              <h3>Grass Pollen</h3>
              <ul className="pollen-levels">
                <li><span className="day">Today:</span> <span className="level">{pollenData.grassPollen.today}</span></li>
                <li><span className="day">Tomorrow:</span> <span className="level">{pollenData.grassPollen.tomorrow}</span></li>
                <li><span className="day">Thursday:</span> <span className="level">{pollenData.grassPollen.thursday}</span></li>
              </ul>
            </div>
            
            <div className={`pollen-type ${selectedPollutant === 'ragweedPollen' ? 'selected' : ''}`} onClick={() => handlePollutantSelect('ragweedPollen')}>
              <div className="pollen-icon ragweed-pollen"></div>
              <h3>Ragweed Pollen</h3>
              <ul className="pollen-levels">
                <li><span className="day">Today:</span> <span className="level">{pollenData.ragweedPollen.today}</span></li>
                <li><span className="day">Tomorrow:</span> <span className="level">{pollenData.ragweedPollen.tomorrow}</span></li>
                <li><span className="day">Thursday:</span> <span className="level">{pollenData.ragweedPollen.thursday}</span></li>
              </ul>
            </div>
          </div>
        </section>
        
        <section className="alert-system">
          <h2>Alert System</h2>
          <p>Set a benchmark for the pollutants to receive alerts</p>
          
          <div className="alert-settings">
            <div className="alert-setting">
              <h3>Tree Pollen</h3>
              <div className="alert-buttons">
                <button 
                  className={`alert-level ${alertThresholds.treePollen === 'Low' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('treePollen', 'Low')}
                >
                  Low
                </button>
                <button 
                  className={`alert-level ${alertThresholds.treePollen === 'Moderate' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('treePollen', 'Moderate')}
                >
                  Moderate
                </button>
                <button 
                  className={`alert-level ${alertThresholds.treePollen === 'High' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('treePollen', 'High')}
                >
                  High
                </button>
              </div>
            </div>
            
            <div className="alert-setting">
              <h3>Grass Pollen</h3>
              <div className="alert-buttons">
                <button 
                  className={`alert-level ${alertThresholds.grassPollen === 'Low' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('grassPollen', 'Low')}
                >
                  Low
                </button>
                <button 
                  className={`alert-level ${alertThresholds.grassPollen === 'Moderate' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('grassPollen', 'Moderate')}
                >
                  Moderate
                </button>
                <button 
                  className={`alert-level ${alertThresholds.grassPollen === 'High' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('grassPollen', 'High')}
                >
                  High
                </button>
              </div>
            </div>
            
            <div className="alert-setting">
              <h3>Ragweed Pollen</h3>
              <div className="alert-buttons">
                <button 
                  className={`alert-level ${alertThresholds.ragweedPollen === 'Low' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('ragweedPollen', 'Low')}
                >
                  Low
                </button>
                <button 
                  className={`alert-level ${alertThresholds.ragweedPollen === 'Moderate' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('ragweedPollen', 'Moderate')}
                >
                  Moderate
                </button>
                <button 
                  className={`alert-level ${alertThresholds.ragweedPollen === 'High' ? 'active' : ''}`}
                  onClick={() => handleSetAlert('ragweedPollen', 'High')}
                >
                  High
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="selected-pollutant">
          <h2>Selected Pollen Concentration</h2>
          <p>Updates automatically as per the scheduler</p>
          
          <div className="pollutant-details">
            <h3>{selectedPollutant === 'treePollen' ? 'Tree Pollen' : 
                 selectedPollutant === 'grassPollen' ? 'Grass Pollen' : 'Ragweed Pollen'}</h3>
            
            <div className="concentration-chart">
              <div className="chart-placeholder">
                <div className="chart-bar" style={{height: '60%'}}><span>Mon</span></div>
                <div className="chart-bar" style={{height: '80%'}}><span>Tue</span></div>
                <div className="chart-bar" style={{height: '50%'}}><span>Wed</span></div>
                <div className="chart-bar" style={{height: '70%'}}><span>Thu</span></div>
                <div className="chart-bar" style={{height: '90%'}}><span>Fri</span></div>
                <div className="chart-bar" style={{height: '40%'}}><span>Sat</span></div>
                <div className="chart-bar" style={{height: '30%'}}><span>Sun</span></div>
              </div>
            </div>
            
            <div className="concentration-levels">
              <div className="level-item">
                <span className="level-dot low"></span>
                <span className="level-text">Low</span>
              </div>
              <div className="level-item">
                <span className="level-dot moderate"></span>
                <span className="level-text">Moderate</span>
              </div>
              <div className="level-item">
                <span className="level-dot high"></span>
                <span className="level-text">High</span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="possible-diseases">
          <h2>Possible Diseases</h2>
          <p>That can happen as per the selected pollutant</p>
          
          <div className="diseases-list">
            {possibleDiseases.map((disease, index) => (
              <div key={index} className="disease-item">
                <div className="disease-icon">
                  <FaInfoCircle />
                </div>
                <div className="disease-info">
                  <h3>{disease.name}</h3>
                  <p>{disease.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="allergy-tips">
          <h2>Tips to Help Manage Your Allergies</h2>
          
          <div className="tips-grid">
            <div className="tip-item">
              <div className="tip-icon">
                <FaShower />
              </div>
              <h3>Shower after being outdoors</h3>
              <p>To remove pollen from your hair and skin to prevent spreading it in your home.</p>
            </div>
            <div className="tip-item">
              <div className="tip-icon">
                <FaShower />
              </div>
              <h3>Shower after being outdoors</h3>
              <p>To remove pollen from your hair and skin to prevent spreading it in your home.</p>
            </div>
            
            <div className="tip-item">
              <div className="tip-icon">
                <FaMask />
              </div>
              <h3>Wear a mask outdoors</h3>
              <p>A quality mask can help filter out pollen particles when pollen counts are high.</p>
            </div>
            
            <div className="tip-item">
              <div className="tip-icon">
                <FaCloudSun />
              </div>
              <h3>Check pollen forecasts</h3>
              <p>Plan outdoor activities when pollen levels are lower, typically on rainy, cloudy, or windless days.</p>
            </div>
            
            <div className="tip-item">
              <div className="tip-icon">
                <FaWind />
              </div>
              <h3>Keep windows closed</h3>
              <p>During high pollen seasons, keep windows closed and use air conditioning to filter the air.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="dashboard-footer">
        <div className="footer-links">
          <a href="#" className="footer-link">Home</a>
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
        <p className="copyright">© 2023 AirAware. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PollutantDashboard;