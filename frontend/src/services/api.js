import axios from 'axios'

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.airaware.com/v1', // Replace with your actual API URL
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to attach the auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login?expired=true'
    }
    
    // Create a more user-friendly error message
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error
    })
  }
)

export default api