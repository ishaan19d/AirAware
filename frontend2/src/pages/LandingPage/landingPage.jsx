import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import LandingNav from '../../components/common/Navbar/landinNav'; // Import LandingNav component
import instagramLogo from '../../assets/instagram.jpg';
import linkedinLogo from '../../assets/linkedin.png';
import facebookLogo from '../../assets/facebook.jpg';

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderItems = [
    { 
      title: "Real-Time Monitoring", 
      description: "Instant air quality updates tailored to your exact location, providing you with the most current environmental insights.",
      icon: "🌍"
    },
    { 
      title: "Personalized Alerts", 
      description: "Customized notifications based on your health profile, local conditions, and specific air quality concerns.",
      icon: "🚨"
    },
    { 
      title: "Comprehensive Analytics", 
      description: "In-depth trend analysis and historical data visualization to help you understand air quality patterns.",
      icon: "📊"
    },
    { 
      title: "Health Recommendations", 
      description: "Expert-backed advice on protecting yourself and your loved ones from poor air quality conditions.",
      icon: "💡"
    },
    { 
      title: "Global Coverage", 
      description: "Extensive air quality information spanning multiple cities, regions, and environmental zones worldwide.",
      icon: "🌐"
    },
    { 
      title: "User-Friendly Interface", 
      description: "Intuitive design that transforms complex environmental data into easy-to-understand, actionable insights.",
      icon: "📱"
    }
  ];

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < Math.ceil(sliderItems.length / 3) - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const scrollToAboutUs = () => {
    document.getElementById('about-us').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <LandingNav /> {/* Use LandingNav component */}
      <section id="home" className="home-section">
        <div className="home-content">
          <h1>Breathe Smarter, Live Healthier</h1>
          <p>Real-Time Air Quality Insights Protecting Your Well-being</p>
          <div className="home-cta">
            <Link to="/signup" className="cta-button">Get Started</Link>
            <button onClick={scrollToAboutUs} className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section id="about-us" className="section about-us-section">
        <h2>About AirAware</h2>
        <p>We are a pioneering platform dedicated to revolutionizing how you understand and interact with your environmental health. Our mission is to empower individuals with precise, real-time air quality data, transforming complex information into actionable insights.</p>
        <div className="about-features">
          <div className="feature">
            <span className="feature-icon">🌿</span>
            <h3>Precision Monitoring</h3>
            <p>Advanced sensors and satellite technology for accurate air quality tracking.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🛡️</span>
            <h3>Health Protection</h3>
            <p>Personalized recommendations to minimize environmental health risks.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🌍</span>
            <h3>Global Perspective</h3>
            <p>Comprehensive data from multiple regions and environmental zones.</p>
          </div>
        </div>
      </section>

      <section id="slider" className="section slider-section">
        <h2>Our Key Features</h2>
        <div className="slider-container">
          <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {sliderItems.map((item, index) => (
              <div className="slider-item" key={index}>
                <span className="slider-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="slider-buttons">
          <button 
            className="slider-button" 
            onClick={handlePrev} 
            disabled={currentSlide === 0}
          >
            &#9664;
          </button>
          <button 
            className="slider-button" 
            onClick={handleNext} 
            disabled={currentSlide === Math.ceil(sliderItems.length / 3) - 1}
          >
            &#9654;
          </button>
        </div>
      </section>

      <section id="subscriptions" className="section subscriptions-section">
        <h2>Subscription Plans</h2>
        
        <div className="subscription-plan">
          <img 
            src="https://via.placeholder.com/300" 
            alt="Basic Plan" 
            className="subscription-image"
          />
          <div className="subscription-plan-details">
            <h3>Basic Plan</h3>
            <p>Essential air quality monitoring for informed living.</p>
            <ul>
              <li>Real-time local air quality updates</li>
              <li>Daily environmental health reports</li>
              <li>Basic health recommendations</li>
              <li>Standard alerts and notifications</li>
            </ul>
            <div className="plan-pricing">
              <span className="price">$9.99</span>
              <span className="duration">/month</span>
            </div>
            <Link to="/signup" className="plan-button">Choose Basic</Link>
          </div>
        </div>

        <div className="subscription-plan">
          <div className="subscription-plan-details">
            <h3>Premium Plan</h3>
            <p>Comprehensive air quality monitoring and personalized insights.</p>
            <ul>
              <li>Advanced air quality analytics</li>
              <li>Personalized health tracking</li>
              <li>Customizable alerts</li>
              <li>Priority support</li>
              <li>Exclusive environmental resources</li>
            </ul>
            <div className="plan-pricing">
              <span className="price">$19.99</span>
              <span className="duration">/month</span>
            </div>
            <Link to="/signup" className="plan-button">Choose Premium</Link>
          </div>
          <img 
            src="https://via.placeholder.com/300" 
            alt="Premium Plan" 
            className="subscription-image"
          />
        </div>
      </section>

      <section id="contact-us" className="section contact-us-section">
        <h2>Connect With Us</h2>
        <div className="contact-details">
          <div className="contact-item">
            <h3>Email Support</h3>
            <p>support@airaware.com</p>
            <p>contact@airaware.com</p>
          </div>
          <div className="contact-item">
            <h3>Customer Service</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri: 9 AM - 5 PM EST</p>
          </div>
          <div className="contact-item">
            <h3>Headquarters</h3>
            <p>AirAware Technologies</p>
            <p>456 Environmental Way</p>
            <p>San Francisco, CA 94105</p>
          </div>
        </div>
        <div className="social-media">
          <a href="https://instagram.com/airaware" target="_blank" rel="noopener noreferrer">
            <img src={instagramLogo} alt="Instagram" />
          </a>
          <a href="https://linkedin.com/company/airaware" target="_blank" rel="noopener noreferrer">
            <img src={linkedinLogo} alt="LinkedIn" />
          </a>
          <a href="https://facebook.com/airaware" target="_blank" rel="noopener noreferrer">
            <img src={facebookLogo} alt="Facebook" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;