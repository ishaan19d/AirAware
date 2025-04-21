import api from './api'

// Mock data for demonstration
const MOCK_AIR_QUALITY_DATA = {
  current: {
    aqi: 42,
    category: "Good",
    color: "#34D399",
    date: new Date().toISOString(),
    location: {
      name: "New Delhi",
      lat: 28.6139,
      lng: 77.2090
    },
    pollutants: {
      co: { value: 0.8, unit: "μg/m³" },
      no: { value: 4.2, unit: "μg/m³" },
      no2: { value: 15.6, unit: "μg/m³" },
      o3: { value: 38.4, unit: "μg/m³" },
      pm2_5: { value: 12.1, unit: "μg/m³" },
      pm10: { value: 23.8, unit: "μg/m³" },
      so2: { value: 3.2, unit: "μg/m³" },
      nh3: { value: 7.6, unit: "μg/m³" }
    }
  },
  forecast: [
    { date: "2025-03-01", aqi: 42, category: "Good", color: "#34D399" },
    { date: "2025-03-02", aqi: 58, category: "Moderate", color: "#FBBF24" },
    { date: "2025-03-03", aqi: 63, category: "Moderate", color: "#FBBF24" },
    { date: "2025-03-04", aqi: 51, category: "Moderate", color: "#FBBF24" },
    { date: "2025-03-05", aqi: 45, category: "Good", color: "#34D399" },
    { date: "2025-03-06", aqi: 38, category: "Good", color: "#34D399" },
    { date: "2025-03-07", aqi: 40, category: "Good", color: "#34D399" },
  ],
  history: [
    { date: "2025-02-20", aqi: 68, category: "Moderate", color: "#FBBF24" },
    { date: "2025-02-21", aqi: 72, category: "Moderate", color: "#FBBF24" },
    { date: "2025-02-22", aqi: 85, category: "Poor", color: "#F97316" },
    { date: "2025-02-23", aqi: 92, category: "Poor", color: "#F97316" },
    { date: "2025-02-24", aqi: 76, category: "Moderate", color: "#FBBF24" },
    { date: "2025-02-25", aqi: 65, category: "Moderate", color: "#FBBF24" },
    { date: "2025-02-26", aqi: 58, category: "Moderate", color: "#FBBF24" },
    { date: "2025-02-27", aqi: 52, category: "Moderate", color: "#FBBF24" },
    { date: "2025-02-28", aqi: 48, category: "Good", color: "#34D399" },
    { date: "2025-03-01", aqi: 42, category: "Good", color: "#34D399" },
  ],
  trends: {
    weekly: [
      { name: "Mon", aqi: 55 },
      { name: "Tue", aqi: 62 },
      { name: "Wed", aqi: 48 },
      { name: "Thu", aqi: 42 },
      { name: "Fri", aqi: 50 },
      { name: "Sat", aqi: 38 },
      { name: "Sun", aqi: 42 }
    ],
    pollutants: {
      pm2_5: [
        { date: "2025-02-24", value: 21.5 },
        { date: "2025-02-25", value: 19.8 },
        { date: "2025-02-26", value: 16.2 },
        { date: "2025-02-27", value: 14.7 },
        { date: "2025-02-28", value: 13.5 },
        { date: "2025-03-01", value: 12.1 }
      ],
      pm10: [
        { date: "2025-02-24", value: 42.8 },
        { date: "2025-02-25", value: 38.5 },
        { date: "2025-02-26", value: 32.6 },
        { date: "2025-02-27", value: 29.4 },
        { date: "2025-02-28", value: 25.7 },
        { date: "2025-03-01", value: 23.8 }
      ],
      o3: [
        { date: "2025-02-24", value: 31.2 },
        { date: "2025-02-25", value: 33.7 },
        { date: "2025-02-26", value: 35.9 },
        { date: "2025-02-27", value: 36.2 },
        { date: "2025-02-28", value: 37.8 },
        { date: "2025-03-01", value: 38.4 }
      ]
    }
  },
  alerts: [
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
}

export const getCurrentAirQuality = async (location) => {
  try {
    // In a real app: return await api.get(`/air-quality/current?lat=${location.lat}&lng=${location.lng}`)
    
    // Mock data
    return MOCK_AIR_QUALITY_DATA.current
  } catch (error) {
    throw error
  }
}

export const getAirQualityForecast = async (location) => {
  try {
    // In a real app: return await api.get(`/air-quality/forecast?lat=${location.lat}&lng=${location.lng}`)
    
    // Mock data
    return MOCK_AIR_QUALITY_DATA.forecast
  } catch (error) {
    throw error
  }
}

export const getAirQualityHistory = async (location, days = 10) => {
  try {
    // In a real app: return await api.get(`/air-quality/history?lat=${location.lat}&lng=${location.lng}&days=${days}`)
    
    // Mock data
    return MOCK_AIR_QUALITY_DATA.history
  } catch (error) {
    throw error
  }
}

export const getPollutantTrends = async (location, pollutant, days = 7) => {
  try {
    // In a real app: 
    // return await api.get(`/air-quality/trends?lat=${location.lat}&lng=${location.lng}&pollutant=${pollutant}&days=${days}`)
    
    // Mock data
    if (pollutant === 'all') {
      return MOCK_AIR_QUALITY_DATA.trends
    }
    
    return MOCK_AIR_QUALITY_DATA.trends.pollutants[pollutant] || []
  } catch (error) {
    throw error
  }
}

export const getAlerts = async (limit = 5) => {
  try {
    // In a real app: return await api.get(`/air-quality/alerts?limit=${limit}`)
    
    // Mock data
    return MOCK_AIR_QUALITY_DATA.alerts
  } catch (error) {
    throw error
  }
}

export const updateAlertSettings = async (settings) => {
  try {
    // In a real app: return await api.post('/user/alert-settings', settings)
    
    // Mock response
    return { success: true, settings }
  } catch (error) {
    throw error
  }
}