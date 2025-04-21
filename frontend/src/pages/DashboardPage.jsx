import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ToastContext } from '../context/ToastContext'
import Navbar from '../components/common/Navbar'
import AirQualityDisplay from '../components/dashboard/AirQualityDisplay'
import PollutantLevels from '../components/dashboard/PollutantLevels'
import TrendsChart from '../components/dashboard/TrendsChart'
import LocationSelector from '../components/dashboard/LocationSelector'
import AlertList from '../components/dashboard/AlertList'
import UpgradeCard from '../components/dashboard/UpgradeCard'
import SafeLimits from '../components/dashboard/SafeLimits'

// Health recommendations by condition
const healthRecommendations = {
  'Asthma': [
    'Avoid exposure to smoke, including tobacco, incense, and candles.',
    'Identify and stay away from allergens that trigger your asthma.',
    'Take prescribed asthma medications regularly, even when symptom-free.',
    'Follow your personalized asthma action plan.',
    'Use a peak flow meter at home to monitor your lung function.',
    'Get annual flu and pneumonia vaccinations.',
    'Maintain a healthy weight and exercise regularly, as tolerated.',
    'Keep indoor air clean—use air purifiers and ventilate rooms.',
    'Manage stress through relaxation techniques and adequate sleep.',
    'Schedule regular check-ups with your healthcare provider.'
  ],
  'COPD': [
    'Quit smoking and avoid exposure to secondhand smoke.',
    'Engage in regular, moderate exercise to strengthen your lungs.',
    'Eat a balanced diet and maintain a healthy weight.',
    'Take medications as prescribed and use inhalers correctly.',
    'Use supplemental oxygen if recommended by your doctor.',
    'Get vaccinated against flu and pneumonia annually.',
    'Avoid respiratory infections—wash hands and avoid sick contacts.',
    'Learn and practice airway clearance techniques to manage mucus.',
    'Join a pulmonary rehabilitation program if available.',
    'Monitor symptoms and have an action plan for flare-ups.'
  ],
  'Bronchitis': [
    'Avoid smoking and exposure to lung irritants.',
    'Get plenty of rest to help your body recover.',
    'Drink lots of fluids to thin mucus and stay hydrated.',
    'Use a humidifier or inhale steam to ease congestion.',
    'Try warm saltwater gargles for throat relief.',
    'Take over-the-counter pain relievers for fever or discomfort.',
    'Use cough medicine only if recommended by your doctor.',
    'Practice good hand hygiene to prevent infections.',
    'Eat a healthy diet to support your immune system.',
    'Avoid strong fumes, dust, and pollution.'
  ],
  'Emphysema': [
    'Quit smoking and avoid all types of smoke.',
    'Stay away from air pollution and occupational irritants.',
    'Get vaccinated against flu and pneumonia.',
    'Practice regular, gentle exercise as tolerated.',
    'Eat a balanced, nutritious diet and maintain a healthy weight.',
    'Drink plenty of fluids to help keep airways clear.',
    'Use prescribed inhalers or medications consistently.',
    'Attend pulmonary rehabilitation if recommended.',
    'Monitor for respiratory infections and seek prompt treatment.',
    'Follow up regularly with your healthcare provider.'
  ],
  'Pneumonia': [
    'Get vaccinated against pneumococcal bacteria and influenza.',
    'Wash hands frequently and practice good hygiene.',
    'Avoid smoking and exposure to secondhand smoke.',
    'Stay away from people who are sick, especially during flu season.',
    'Drink plenty of fluids to stay hydrated and thin mucus.',
    'Rest as much as possible during recovery.',
    'Follow your doctor\'s instructions and complete all prescribed medications.',
    'Eat a nutritious diet to support your immune system.',
    'Use a humidifier or inhale steam to ease breathing.',
    'Seek medical attention promptly if symptoms worsen.'
  ],
  'Lung Cancer': [
    'Don\'t smoke; quitting is the most effective prevention.',
    'Avoid secondhand smoke and environments where smoking occurs.',
    'Test your home for radon and reduce exposure if necessary.',
    'Avoid occupational exposures to carcinogens (asbestos, arsenic, etc.).',
    'Maintain a healthy diet rich in fruits and vegetables.',
    'Exercise regularly to boost lung health.',
    'Get regular screenings if you are at high risk (e.g., heavy smokers).',
    'Limit exposure to air pollution.',
    'Follow all workplace safety guidelines regarding hazardous materials.',
    'See a doctor for any persistent cough, chest pain, or unexplained weight loss.'
  ],
  'Allergic Rhinitis': [
    'Avoid known allergens (pollen, dust, pet dander, etc.).',
    'Use air purifiers and keep windows closed during high pollen seasons.',
    'Wash bedding regularly in hot water.',
    'Keep your home clean and free of dust.',
    'Try saline nasal rinses to clear allergens from nasal passages.',
    'Use antihistamines or intranasal corticosteroids as prescribed.',
    'Consider immunotherapy for persistent symptoms.',
    'Wear sunglasses outdoors to protect eyes from pollen.',
    'Keep pets out of bedrooms and groom them regularly.',
    'Monitor pollen counts and limit outdoor activities when high.'
  ],
  'Sinusitis': [
    'Use saline nasal irrigation or sprays to clear sinuses.',
    'Inhale steam or use a humidifier to relieve congestion.',
    'Drink plenty of fluids to thin mucus.',
    'Avoid smoking and exposure to pollutants.',
    'Manage allergies promptly to prevent sinusitis.',
    'Rest and avoid strenuous activity during acute episodes.',
    'Take over-the-counter pain relievers for headache or facial pain.',
    'Avoid using decongestant nasal sprays for more than 3 days.',
    'Practice good hand hygiene to prevent infections.',
    'Seek medical attention if symptoms persist beyond 10 days or worsen.'
  ],
  'Respiratory Tract Infection': [
    'Wash hands frequently and avoid touching your face.',
    'Get vaccinated against flu and other respiratory pathogens.',
    'Avoid close contact with people who are sick.',
    'Disinfect commonly touched surfaces regularly.',
    'Stay home when you are ill to prevent spreading infection.',
    'Cover your mouth and nose when coughing or sneezing.',
    'Maintain good indoor air quality and humidity.',
    'Drink plenty of fluids and rest to support recovery.',
    'Avoid smoking and exposure to irritants.',
    'Complete any prescribed course of antibiotics if indicated.'
  ],
  'Cough and Throat Irritation': [
    'Stay hydrated by drinking plenty of fluids.',
    'Use steam inhalation or humidifiers to soothe airways.',
    'Gargle with warm salt water for throat relief.',
    'Avoid irritants like smoke, dust, and strong fumes.',
    'Use lozenges or honey (if age-appropriate) to soothe the throat.',
    'Rest your voice and get adequate sleep.',
    'Try warm teas or broths for comfort.',
    'Avoid caffeine and alcohol, which can dehydrate you.',
    'Use over-the-counter cough remedies as advised by your doctor.',
    'Seek medical advice if cough persists more than 3 weeks or worsens.'
  ],
  'Pulmonary Fibrosis': [
    'Avoid smoking and exposure to secondhand smoke.',
    'Stay up to date with flu and pneumonia vaccinations.',
    'Avoid exposure to dust, chemicals, and other lung irritants.',
    'Engage in pulmonary rehabilitation if recommended.',
    'Maintain a healthy diet and exercise as tolerated.',
    'Use supplemental oxygen if prescribed.',
    'Monitor for respiratory infections and seek prompt treatment.',
    'Practice breathing exercises to improve lung function.',
    'Attend regular follow-ups with your healthcare provider.',
    'Join a support group for emotional and informational support.'
  ],
  'Tuberculosis': [
    'Take all TB medications exactly as prescribed for the full course.',
    'Cover your mouth when coughing or sneezing to prevent spread.',
    'Ensure good ventilation in living spaces.',
    'Attend all follow-up appointments and tests.',
    'Eat a balanced, nutritious diet to support recovery.',
    'Avoid close contact with others until your doctor says you\'re no longer contagious.',
    'Inform close contacts so they can be tested if necessary.',
    'Rest and get adequate sleep to help your body heal.',
    'Avoid alcohol and substances that can harm your liver.',
    'Report any medication side effects to your healthcare provider promptly.'
  ],
  'Obstructive Sleep Apnea': [
    'Maintain a healthy weight; weight loss can reduce symptoms.',
    'Sleep on your side instead of your back.',
    'Avoid alcohol and sedatives before bedtime.',
    'Use a continuous positive airway pressure (CPAP) device if prescribed.',
    'Keep regular sleep hours and establish a bedtime routine.',
    'Treat nasal congestion or allergies to improve airflow.',
    'Avoid heavy meals and caffeine close to bedtime.',
    'Elevate the head of your bed if recommended.',
    'Exercise regularly to improve sleep quality.',
    'Attend regular follow-ups for device adjustments and monitoring.'
  ]
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext)
  const { addToast } = useContext(ToastContext)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [airQualityData, setAirQualityData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [trendsData, setTrendsData] = useState(null)
  const [alertsData, setAlertsData] = useState(null)
  const [locationDetected, setLocationDetected] = useState(false)
  
  // Health recommendations state
  const [selectedCondition, setSelectedCondition] = useState('')
  const [currentRecommendations, setCurrentRecommendations] = useState([])
  const [userDiseases, setUserDiseases] = useState([])
  
  // Map the disease names from JWT to match the keys in healthRecommendations
  const diseaseMapping = {
    'Pulmonary fibrosis': 'Pulmonary Fibrosis',
    'Sinusitis': 'Sinusitis',
    'Asthma': 'Asthma',
    'COPD': 'COPD',
    'Bronchitis': 'Bronchitis',
    'Emphysema': 'Emphysema',
    'Pneumonia': 'Pneumonia',
    'Lung Cancer': 'Lung Cancer',
    'Allergic Rhinitis': 'Allergic Rhinitis',
    'Respiratory Tract Infection': 'Respiratory Tract Infection',
    'Cough and Throat Irritation': 'Cough and Throat Irritation',
    'Tuberculosis': 'Tuberculosis',
    'Obstructive Sleep Apnea': 'Obstructive Sleep Apnea'
  };
  
  // Extract user's diseases from JWT and set default selected condition
  useEffect(() => {
    if (user && user.diseases && user.diseases.length > 0) {
      // Map the diseases from JWT to match the keys in healthRecommendations
      const mappedDiseases = user.diseases.map(disease => 
        diseaseMapping[disease] || disease
      ).filter(disease => healthRecommendations[disease]); // Only include diseases that have recommendations
      
      setUserDiseases(mappedDiseases);
      
      // Set the first disease as the default selected condition if available
      if (mappedDiseases.length > 0 && !selectedCondition) {
        setSelectedCondition(mappedDiseases[0]);
      } else if (mappedDiseases.length === 0) {
        // Fallback to Asthma if no matching diseases
        setSelectedCondition('Asthma');
      }
    } else {
      // Fallback if no diseases in user data
      setUserDiseases(Object.keys(healthRecommendations));
      setSelectedCondition('Asthma');
    }
  }, [user, selectedCondition]);
  
  // Function to get random recommendations
  const getRandomRecommendations = useCallback((condition) => {
    const allRecommendations = healthRecommendations[condition];
    const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);
  
  // Update recommendations when condition changes or when refreshed
  useEffect(() => {
    if (selectedCondition && healthRecommendations[selectedCondition]) {
      setCurrentRecommendations(getRandomRecommendations(selectedCondition));
    }
  }, [selectedCondition, getRandomRecommendations]);
  
  // Refresh recommendations
  const refreshRecommendations = () => {
    setCurrentRecommendations(getRandomRecommendations(selectedCondition));
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation.name)
  }

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      )
      const data = await response.json()

      if (data && data.address) {
        const { city, town, village, county, state } = data.address
        const locationName = `${city || town || village || county || 'Unknown'}, ${state || ''}`.trim()
        setLocation(locationName)
        return { city: city || town || village || county || 'Unknown', state: state || '' }
      } else {
        console.warn("Reverse geocoding failed to find a location.")
        addToast("Failed to automatically detect location.", "error")
        return { city: 'Unknown', state: '' }
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      addToast("Failed to automatically detect location.", "error")
      return { city: 'Unknown', state: '' }
    }
  }

  const fetchAirQualityData = useCallback(async (lat, lon) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost/api/air-quality/fetch?lat=${lat}&lon=${lon}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('API response:', data)

      if (!data || !data.aqi || !data.components) {
        throw new Error('Incomplete data received from the API')
      }

      const currentAQ = {
        aqi: data.aqi || 0,
        category: getAQICategory(data.aqi),
        color: getAQIColor(data.aqi),
        pollutants: Object.entries(data.components).reduce((acc, [key, value]) => {
          acc[key] = {
            value: parseFloat(value) || 0,
            unit: 'μg/m³'
          }
          return acc
        }, {})
      }

      setAirQualityData(currentAQ)
    } catch (error) {
      console.error('Error fetching air quality data:', error)
      addToast('Failed to load real-time data. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  const fetchTimeSeriesData = useCallback(async (city, state) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost/api/air-quality/location?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('Time series response:', response)

      if (!response.ok) throw new Error('Failed to fetch time series data')

      const data = await response.json()
      console.log("Time series data:", data)

      const processedData = processTimeSeriesData(data)
      setTrendsData(processedData)
    } catch (error) {
      console.error('Time series fetch error:', error)
      addToast('Failed to load historical data. Please try again.', 'error')
    }
  }, [addToast])

  const processTimeSeriesData = (data) => {
    const timestamps = data.map(item => {
      const date = new Date(item.timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    const metrics = {
      aqi: data.map(item => item.aqi || 0),
      co: data.map(item => item.components?.co || 0),
      no2: data.map(item => item.components?.no2 || 0),
      o3: data.map(item => item.components?.o3 || 0),
      pm2_5: data.map(item => item.components?.pm2_5 || 0),
      pm10: data.map(item => item.components?.pm10 || 0),
      so2: data.map(item => item.components?.so2 || 0)
    }

    return { timestamps, metrics }
  }

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Satisfactory'
    if (aqi <= 200) return 'Moderate'
    if (aqi <= 300) return 'Poor'
    if (aqi <= 400) return 'Very Poor'
    return 'Severe'
  }

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#34D399'
    if (aqi <= 100) return '#A3E635'
    if (aqi <= 200) return '#FBBF24'
    if (aqi <= 300) return '#F97316'
    if (aqi <= 400) return '#EF4444'
    return '#7E22CE'
  }

  const getUserLocation = useCallback(async () => {
    if (locationDetected) return;
    
    setLocationDetected(true);
    
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'warning')
      setLocation('Geolocation not supported')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const { city, state } = await reverseGeocode(latitude, longitude)
        fetchAirQualityData(latitude, longitude)
        if (city && state && city !== 'Unknown') {
          fetchTimeSeriesData(city, state)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        addToast('Failed to get your location. Please select manually.', 'warning')
        setLocation('Unable to fetch location')
        setLoading(false)
      }
    )
  }, [addToast, fetchAirQualityData, fetchTimeSeriesData, locationDetected, reverseGeocode])

  // Automatically detect location when component mounts - only once
  useEffect(() => {
    getUserLocation();
    // Don't include getUserLocation in dependencies to prevent loop
  }, []);

  useEffect(() => {
    if (!location) return

    const fetchDashboardData = async () => {
      try {
        // Mock data for forecast and alerts if not fetched from API
        const forecast = [
          { date: "2025-03-01", aqi: 42, category: "Good", color: "#34D399" },
          { date: "2025-03-02", aqi: 58, category: "Moderate", color: "#FBBF24" },
          { date: "2025-03-03", aqi: 63, category: "Moderate", color: "#FBBF24" },
          { date: "2025-03-04", aqi: 51, category: "Moderate", color: "#FBBF24" },
          { date: "2025-03-05", aqi: 45, category: "Good", color: "#34D399" }
        ]
        const alerts = [
          {
            id: "1",
            date: "2025-02-22T08:15:00Z",
            type: "warning",
            message: "PM2.5 levels elevated above normal range",
            pollutant: "pm2_5",
            value: 42.3
          },
          {
            id: "2",
            date: "2025-02-23T14:30:00Z",
            type: "alert",
            message: "Poor air quality detected - consider limiting outdoor activity",
            pollutant: "aqi",
            value: 92
          }
        ]

        setForecastData(forecast)
        setAlertsData(alerts)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        addToast('Failed to load data. Please try again.', 'error')
      }
    }

    fetchDashboardData()
  }, [location, addToast])

  const isPremiumUser = user?.isPremiumUser

  // New states for disease selection
  const [availableDiseases, setAvailableDiseases] = useState([])
  const [selectedDiseases, setSelectedDiseases] = useState([])
  const [currentDisease, setCurrentDisease] = useState('')
  const [isSavingDiseases, setIsSavingDiseases] = useState(false)
  const [diseasesFetched, setDiseasesFetched] = useState(false)
  
  // Fetch available diseases from API
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await fetch('http://localhost/api/predictor/get-disease-list')
        if (!response.ok) {
          throw new Error('Failed to fetch diseases')
        }
        const data = await response.json()
        setAvailableDiseases(data)
        setDiseasesFetched(true)
      } catch (error) {
        console.error('Error fetching diseases:', error)
        addToast('Failed to load diseases. Please try again.', 'error')
      }
    }
    
    fetchDiseases()
  }, [addToast])
  
  // Initialize selected diseases from user data
  useEffect(() => {
    if (user && user.diseases && user.diseases.length > 0 && diseasesFetched) {
      setSelectedDiseases(user.diseases)
    }
  }, [user, diseasesFetched])
  
  // Handle disease selection
  const handleDiseaseChange = (e) => {
    setCurrentDisease(e.target.value)
  }
  
  // Add a disease to selected diseases
  const addDisease = () => {
    if (currentDisease && !selectedDiseases.includes(currentDisease)) {
      setSelectedDiseases([...selectedDiseases, currentDisease])
      setCurrentDisease('')
    }
  }
  
  // Remove a disease from selected diseases
  const removeDisease = (disease) => {
    setSelectedDiseases(selectedDiseases.filter(d => d !== disease))
  }
  
  // Save selected diseases to user profile
  const saveDiseases = async () => {
    try {
      setIsSavingDiseases(true)
      const token = localStorage.getItem('token')
      
      // Update diseases
      const updateResponse = await fetch('http://localhost/api/modify-disease', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ diseases: selectedDiseases })
      })
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update diseases')
      }
      
      // Refresh user data
      const userResponse = await fetch('http://localhost/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch updated user data')
      }
      
      const userData = await userResponse.json()
      
      // Update local storage with new user data
      localStorage.setItem('userMeta', JSON.stringify({
        ...JSON.parse(localStorage.getItem('userMeta') || '{}'),
        diseases: userData.diseases || []
      }))
      
      addToast('Diseases updated successfully', 'success')
    } catch (error) {
      console.error('Error saving diseases:', error)
      addToast('Failed to update diseases. Please try again.', 'error')
    } finally {
      setIsSavingDiseases(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Air Quality Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isPremiumUser ? 'Pro Plan' : 'Free Plan'} | Welcome back, {user?.name || 'User'}
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {loading ? 'Detecting your location...' : `Your location: ${location}`}
            </p>
          </div>
        </div>

        {/* First row with AQI and SafeLimits (cards swapped) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <AirQualityDisplay aqiData={airQualityData} isLoading={loading} />
            
            {/* SafeLimits card moved here below AQI */}
            <div className="mt-6">
              <SafeLimits />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Pollutant Levels stays at its position */}
            <PollutantLevels pollutants={airQualityData?.pollutants} isLoading={loading} />
            
            {/* Recent Alerts card moved here */}
            {isPremiumUser ? (
              <AlertList alerts={alertsData} isLoading={loading} />
            ) : (
              <UpgradeCard />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TrendsChart trends={trendsData} isLoading={loading} />
        </div>

        {/* Free users see the health recommendations here */}
        {!isPremiumUser && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Health Recommendations
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tips to manage your respiratory health
                </p>
              </div>
              <div className="flex space-x-2">
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {userDiseases.map(condition => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
                <button
                  onClick={refreshRecommendations}
                  className="bg-brand-50 dark:bg-gray-700 text-brand-600 dark:text-brand-400 p-1 rounded-md hover:bg-brand-100 dark:hover:bg-gray-600"
                  title="Refresh recommendations"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-4">
              {currentRecommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-right">
              <span>These recommendations are general. Always consult your healthcare provider for personalized advice.</span>
            </div>
          </div>
        )}

        {isPremiumUser && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Replace Health Predictions with Health Recommendations for premium users */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Health Recommendations
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tips to manage your respiratory health
                  </p>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {userDiseases.map(condition => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={refreshRecommendations}
                    className="bg-brand-50 dark:bg-gray-700 text-brand-600 dark:text-brand-400 p-1 rounded-md hover:bg-brand-100 dark:hover:bg-gray-600"
                    title="Refresh recommendations"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                {currentRecommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="ml-3 text-gray-700 dark:text-gray-300">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                <span>These recommendations are general. Always consult your healthcare provider for personalized advice.</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Your Health Conditions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select your conditions
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={currentDisease}
                      onChange={handleDiseaseChange}
                      className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select a condition</option>
                      {availableDiseases.map((disease) => (
                        <option key={disease} value={disease}>
                          {disease}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addDisease}
                      disabled={!currentDisease}
                      className="px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your selected conditions
                  </label>
                  {selectedDiseases.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No conditions selected
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedDiseases.map((disease) => (
                        <div 
                          key={disease}
                          className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">{disease}</span>
                          <button
                            onClick={() => removeDisease(disease)}
                            className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={saveDiseases}
                  disabled={isSavingDiseases}
                  className="mt-4 w-full px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-md text-sm font-medium disabled:opacity-50 flex justify-center items-center"
                >
                  {isSavingDiseases ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Health Conditions'
                  )}
                </button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your health conditions help us provide more relevant recommendations and alerts tailored to your specific needs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage