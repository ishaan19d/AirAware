import { useState } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const TrendsChart = ({ trends, isLoading }) => {
  const [activeMetric, setActiveMetric] = useState('aqi')

  const metrics = [
    { id: 'aqi', name: 'Air Quality Index', color: '#8884d8' },
    { id: 'pm2_5', name: 'PM2.5', color: '#82ca9d' },
    { id: 'pm10', name: 'PM10', color: '#ffc658' },
    { id: 'o3', name: 'Ozone', color: '#ff6f61' },
    { id: 'co', name: 'Carbon Monoxide (CO)', color: '#6a5acd' },
    { id: 'no2', name: 'Nitrogen Dioxide (NO₂)', color: '#ffa500' },
    { id: 'so2', name: 'Sulphur Dioxide (SO₂)', color: '#d81b60' }
  ]

  if (isLoading || !trends) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500">Loading chart data...</span>
        </div>
      </div>
    )
  }

  const selectedMetric = metrics.find(p => p.id === activeMetric)
  const chartData = trends.metrics[activeMetric].map((value, index) => ({
    date: trends.timestamps[index],
    value
  }))

  const formatDate = (dateString) => {
    return dateString // Already formatted in processTimeSeriesData
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">
          Air Quality Trends
        </h3>
        <div className="flex space-x-2">
          <select
            value={activeMetric}
            onChange={(e) => setActiveMetric(e.target.value)}
            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#9ca3af"
            />
            <YAxis 
              stroke="#9ca3af"
              domain={[0, 'auto']}
              label={{ value: activeMetric === 'aqi' ? 'AQI Value' : 'Concentration (µg/m³)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value} ${activeMetric === 'aqi' ? '' : 'μg/m³'}`, selectedMetric.name]}
              labelFormatter={formatDate}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={selectedMetric.color} 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedMetric.name} concentration over time.
        </p>
      </div>
    </div>
  )
}

export default TrendsChart