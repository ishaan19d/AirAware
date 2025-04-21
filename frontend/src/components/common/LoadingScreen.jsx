import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <motion.div
          className="inline-block w-20 h-20 mb-4"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-brand-500"
          >
            <path 
              d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <path 
              d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeDasharray="1 3"
            />
          </svg>
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading...</h2>
        <p className="text-gray-600 dark:text-gray-400">Please wait a moment</p>
      </div>
    </div>
  )
}

export default LoadingScreen