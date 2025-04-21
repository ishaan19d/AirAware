import { motion } from 'framer-motion'

const pollutantInfo = {
  pm2_5: {
    name: 'PM2.5',
    description: 'Fine particulate matter (diameter < 2.5μm)',
    dangerLevel: 35, // EPA standard for 24hr exposure
    categories: {
      'Good': [0, 30],
      'Fair': [31, 60],
      'Poor': [61, 120],
      'Severe': [121, 350]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14a7 7 0 00-7-7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    )
  },
  pm10: {
    name: 'PM10',
    description: 'Coarse particulate matter (diameter < 10μm)',
    dangerLevel: 150, // EPA standard for 24hr exposure
    categories: {
      'Good': [0, 50],
      'Fair': [51, 100],
      'Poor': [101, 350],
      'Severe': [351, 550]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 12a5 5 0 10-10 0" />
      </svg>
    )
  },
  o3: {
    name: 'O₃',
    description: 'Ozone',
    dangerLevel: 70, // EPA standard in ppb
    categories: {
      'Good': [0, 50],
      'Fair': [51, 100],
      'Poor': [101, 200],
      'Severe': [201, 400]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  co: {
    name: 'CO',
    description: 'Carbon Monoxide',
    dangerLevel: 9, // EPA standard in ppm
    categories: {
      'Good': [0, 1000],
      'Fair': [1001, 2000],
      'Poor': [2001, 10000],
      'Severe': [10001, 15000]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  no2: {
    name: 'NO₂',
    description: 'Nitrogen Dioxide',
    dangerLevel: 100, // EPA standard in ppb
    categories: {
      'Good': [0, 40],
      'Fair': [41, 80],
      'Poor': [81, 280],
      'Severe': [281, 400]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  so2: {
    name: 'SO₂',
    description: 'Sulfur Dioxide',
    dangerLevel: 75, // EPA standard in ppb
    categories: {
      'Good': [0, 40],
      'Fair': [41, 80],
      'Poor': [81, 800],
      'Severe': [801, 1200]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    )
  },
  nh3: {
    name: 'NH₃',
    description: 'Ammonia',
    dangerLevel: 1800, // General safety standard in ppb
    categories: {
      'Good': [0, 200],
      'Fair': [201, 400],
      'Poor': [401, 1200],
      'Severe': [1201, 1800]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  no: {
    name: 'NO',
    description: 'Nitric Oxide',
    dangerLevel: 100, // Approximate safety standard
    categories: {
      'Good': [0, 40],
      'Fair': [41, 80],
      'Poor': [81, 280],
      'Severe': [281, 400]
    },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
}

const PollutantLevels = ({ pollutants, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pollutant Levels</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pollutant Levels</h3>

      <div className="space-y-5">
        {pollutants &&
          Object.entries(pollutants).map(([key, data], index) => {
            const info = pollutantInfo[key];
            if (!info) return null;

            // Ensure value is a valid number
            const value = parseFloat(data.value) || 0;
            
            // Determine category and color based on the value
            let category = 'Unknown';
            let barColor = 'bg-gray-500';
            
            if (info.categories) {
              if (value <= info.categories['Good'][1]) {
                category = 'Good';
                barColor = 'bg-green-500';
              } else if (value <= info.categories['Fair'][1]) {
                category = 'Fair';
                barColor = 'bg-yellow-500';
              } else if (value <= info.categories['Poor'][1]) {
                category = 'Poor';
                barColor = 'bg-orange-500';
              } else {
                category = 'Severe';
                barColor = 'bg-red-500';
              }
            }
            
            // Calculate normalized percentage for progress bar
            const maxValue = info.categories ? info.categories['Severe'][1] : info.dangerLevel;
            const percentage = Math.min((value / maxValue) * 100, 100);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 mr-2">{info.icon}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{info.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded mr-2 ${
                      category === 'Good' ? 'bg-green-100 text-green-800' :
                      category === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                      category === 'Poor' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {category}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {value.toFixed(2)} {data.unit}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                  <motion.div
                    className={`h-2 rounded-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  ></motion.div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">{info.description}</p>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default PollutantLevels;