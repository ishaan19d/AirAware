import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const AirQualityDisplay = ({ aqiData, isLoading }) => {
  const [category, setCategory] = useState('Good')
  const [color, setColor] = useState('#34D399')
  
  useEffect(() => {
    if (aqiData) {
      setCategory(aqiData.category)
      setColor(aqiData.color)
    }
  }, [aqiData])
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-48 animate-pulse">
        <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    )
  }
  
  // Define AQI level descriptions
  const descriptions = {
    'Good': 'Air quality is satisfactory, and air pollution poses little or no risk.',
    'Moderate': 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
    'Poor': 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    'Unhealthy': 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
    'Hazardous': 'Health alert: The risk of health effects is increased for everyone.'
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-6 flex flex-col items-center justify-center transition-colors duration-500"
        style={{ backgroundColor: `${color}25` }} // Very light version of the color
      >
        <motion.div 
          className="relative flex items-center justify-center mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-32 h-32" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e6e6e6"
              strokeWidth="12"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray="339.3"
              strokeDashoffset={339.3 - (339.3 * aqiData?.aqi) / 500}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color }}>
              {aqiData?.aqi}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">AQI</span>
          </div>
        </motion.div>
        
        <h3 className="text-2xl font-bold" style={{ color }}>
          {category}
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-300 mt-2 text-sm">
          {descriptions[category] || 'No description available'}
        </p>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{aqiData?.location?.name}</span>
        </div>
      </div>
    </div>
  )
}

export default AirQualityDisplay