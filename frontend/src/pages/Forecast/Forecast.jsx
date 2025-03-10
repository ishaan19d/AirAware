import React from 'react';
import { FaCalendarAlt, FaTemperatureHigh, FaWind } from 'react-icons/fa';
import './Forecast.css';

const Forecast = ({ forecastData }) => {
  // If no data is provided, use sample data
  const data = forecastData || [
    {
      day: 'Today',
      date: 'Oct 15',
      aqi: 45,
      category: 'Good',
      temperature: '24°C',
      humidity: '65%',
      wind: '10 km/h'
    },
    {
      day: 'Tomorrow',
      date: 'Oct 16',
      aqi: 52,
      category: 'Moderate',
      temperature: '26°C',
      humidity: '60%',
      wind: '8 km/h'
    },
    {
      day: 'Wednesday',
      date: 'Oct 17',
      aqi: 48,
      category: 'Good',
      temperature: '25°C',
      humidity: '62%',
      wind: '12 km/h'
    },
    {
      day: 'Thursday',
      date: 'Oct 18',
      aqi: 55,
      category: 'Moderate',
      temperature: '27°C',
      humidity: '58%',
      wind: '15 km/h'
    },
    {
      day: 'Friday',
      date: 'Oct 19',
      aqi: 50,
      category: 'Good',
      temperature: '23°C',
      humidity: '70%',
      wind: '9 km/h'
    }
  ];

  // Function to determine AQI category class
  const getAqiClass = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower === 'good') return 'aqi-good';
    if (categoryLower === 'moderate') return 'aqi-moderate';
    if (categoryLower === 'unhealthy') return 'aqi-unhealthy';
    if (categoryLower === 'very unhealthy') return 'aqi-very-unhealthy';
    if (categoryLower === 'hazardous') return 'aqi-hazardous';
    return '';
  };

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h2>5-Day Air Quality Forecast</h2>
        <p>Plan your outdoor activities with our accurate air quality predictions</p>
      </div>
      
      <div className="forecast-cards">
        {data.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-day">
              <FaCalendarAlt className="forecast-icon" />
              <div>
                <h3>{day.day}</h3>
                <p>{day.date}</p>
              </div>
            </div>
            
            <div className={`forecast-aqi ${getAqiClass(day.category)}`}>
              <span className="forecast-aqi-value">{day.aqi}</span>
              <span className="forecast-aqi-category">{day.category}</span>
            </div>
            
            <div className="forecast-weather">
              <div className="forecast-weather-item">
                <FaTemperatureHigh />
                <span>{day.temperature}</span>
              </div>
              <div className="forecast-weather-item">
                <span>Humidity: {day.humidity}</span>
              </div>
              <div className="forecast-weather-item">
                <FaWind />
                <span>{day.wind}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;