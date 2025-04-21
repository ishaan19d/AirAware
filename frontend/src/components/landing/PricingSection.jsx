import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = {
  free: [
    { name: 'Current air quality index (AQI)', available: true },
    { name: 'Basic pollutant levels', available: true },
   
    { name: 'Basic alerts', available: true },
    { name: 'Location-based monitoring', available: true },
    { name: 'Health recommendations', available: false },
    { name: 'Historical data analysis', available: false },
    { name: 'Custom alert thresholds', available: false },
    { name: 'Health condition tracking', available: false },
    { name: 'Personalized impact assessments', available: false },
  ],
  pro: [
    { name: 'Current air quality index (AQI)', available: true },
    { name: 'Detailed pollutant analysis', available: true },
  
    { name: 'Priority alerts', available: true },
    { name: 'Location-based monitoring', available: true },
    { name: 'Personalized health recommendations', available: true },
    { name: 'Historical data analysis', available: true },
    { name: 'Custom alert thresholds', available: true },
    { name: 'Health condition tracking', available: true },
    { name: 'Personalized impact assessments', available: true },
  ]
}

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade anytime as your requirements grow.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Perfect for casual users</p>
              <p className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹0</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </p>
              
              <Link
                to="/signup"
                className="mt-6 block w-full py-3 px-4 rounded-md text-center font-medium bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Get Started
              </Link>
            </div>
            
            <div className="px-6 pb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">What's included:</h4>
              <ul className="space-y-3">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-brand-500">
                      {feature.available ? (
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg fill="currentColor" viewBox="0 0 20 20" className="text-gray-300 dark:text-gray-600">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className={`ml-2 text-gray-600 dark:text-gray-300 ${!feature.available && 'line-through text-gray-400 dark:text-gray-500'}`}>
                      {feature.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border-2 border-brand-500 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 bg-brand-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
              Recommended
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pro</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">For health-conscious individuals</p>
              <p className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹1,500</span>
                <span className="text-gray-500 dark:text-gray-400"> (One-Time Payment)</span>
              </p>
              
              <Link
                to="/subscription"
                className="mt-6 block w-full py-3 px-4 rounded-md text-center font-medium bg-brand-600 text-white hover:bg-brand-700"
              >
                Upgrade to Pro
              </Link>
            </div>
            
            <div className="px-6 pb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Everything in Free, plus:</h4>
              <ul className="space-y-3">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-brand-500">
                      {feature.available && (
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="ml-2 text-gray-600 dark:text-gray-300">
                      {feature.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection