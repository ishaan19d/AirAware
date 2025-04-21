import { useState, useEffect } from 'react'

const savedLocations = [
  { id: 1, name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { id: 2, name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { id: 3, name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
]

const LocationSelector = ({ onLocationChange }) => {
  const [currentLocation, setCurrentLocation] = useState(savedLocations[0])
  const [showDropdown, setShowDropdown] = useState(false)
  
  useEffect(() => {
    if (currentLocation) {
      onLocationChange(currentLocation)
    }
  }, [currentLocation, onLocationChange])
  
  const handleLocationSelect = (location) => {
    setCurrentLocation(location)
    setShowDropdown(false)
  }
  
  const handleAddCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            id: Date.now(),
            name: 'Current Location',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          
          // In a real app, we would save this to the user's profile
          // For now, just use it as the current location
          setCurrentLocation(newLocation)
          setShowDropdown(false)
        },
        (error) => {
          console.error('Error getting current location:', error)
          alert('Unable to retrieve your location. Please allow location access or select a location manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }
  
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="flex-1 text-left">{currentLocation?.name}</span>
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {savedLocations.map((location) => (
              <li key={location.id}>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  onClick={() => handleLocationSelect(location)}
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location.name}
                </button>
              </li>
            ))}
            <li className="border-t border-gray-200 dark:border-gray-700">
              <button
                className="flex items-center gap-2 px-4 py-2 text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                onClick={handleAddCurrentLocation}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Use current location
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default LocationSelector