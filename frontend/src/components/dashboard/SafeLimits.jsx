import React from 'react'

const SafeLimits = () => {
  const pollutantLimits = [
    { pollutant: 'PM2.5', limit: '15 μg/m³', description: '24-hour average', severity: 'low' },
    { pollutant: 'PM10', limit: '45 μg/m³', description: '24-hour average', severity: 'low' },
    { pollutant: 'CO', limit: '4 mg/m³', description: '24-hour average', severity: 'low' },
    { pollutant: 'NO₂', limit: '25 μg/m³', description: '24-hour average', severity: 'low' },
    { pollutant: 'O₃', limit: '100 μg/m³', description: '8-hour average', severity: 'low' },
    { pollutant: 'SO₂', limit: '40 μg/m³', description: '24-hour average', severity: 'low' }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
      case 'low': return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-5">
        Safe Pollutant Limits
      </h3>
      <div className="space-y-3">
        {pollutantLimits.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white mr-2">
                {item.pollutant}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
              {item.limit}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Based on WHO air quality guidelines and national standards for healthy air quality levels.
        </p>
      </div>
    </div>
  )
}

export default SafeLimits