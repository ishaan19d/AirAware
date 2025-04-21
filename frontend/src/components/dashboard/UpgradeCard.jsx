import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const UpgradeCard = () => {
  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative p-6">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        
        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-2">
            Upgrade to Pro
          </h3>
          
          <p className="text-white/80 mb-6">
            Unlock premium features to protect your health
          </p>
          
          <motion.div
            className="space-y-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[
              'Advanced health predictions',
              'Track multiple locations',
              'Historical data analysis',
              'Custom alert thresholds',
              'Personalized recommendations'
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <svg className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/subscription"
              className="block w-full py-2 px-4 bg-white text-brand-600 hover:bg-gray-100 text-center font-medium rounded-md shadow transition-colors"
            >
              Upgrade Now
            </Link>
          </motion.div>
          
          <p className="text-xs text-white/60 mt-4 text-center">
            Starting at ₹1,500/month
          </p>
        </div>
      </div>
    </div>
  )
}

export default UpgradeCard