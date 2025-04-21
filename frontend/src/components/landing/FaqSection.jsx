import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: "How accurate is the air quality data?",
    answer: "AirAware uses data from government-operated monitoring stations, satellite observations, and advanced machine learning models to provide highly accurate air quality information. In most urban and suburban areas, our accuracy rate exceeds 95% compared to reference instruments."
  },
  {
    question: "How often is the air quality data updated?",
    answer: "For free users, data is updated hourly. Pro subscribers receive real-time updates as soon as new data becomes available, typically every 10-15 minutes depending on your location."
  },
  {
    question: "Can I monitor air quality for multiple locations?",
    answer: "Free users can monitor one location at a time. Pro subscribers can save and monitor up to 5 different locations simultaneously, making it perfect for tracking air quality at home, work, school, or other frequent destinations."
  },
  {
    question: "What pollutants does AirAware track?",
    answer: "AirAware tracks all major pollutants including PM2.5, PM10, ozone (O3), nitrogen dioxide (NO2), sulfur dioxide (SO2), carbon monoxide (CO), and more. Pro users get additional insights on pollen, mold, and VOC levels where available."
  },
  {
    question: "How do I customize alert thresholds?",
    answer: "Pro subscribers can set custom alert thresholds for each pollutant in the settings section of their dashboard. This allows you to receive notifications based on your specific health needs and sensitivities."
  }
]

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const scrollToFooter = () => {
    const footerElement = document.querySelector('footer')
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="mb-4 border-b border-gray-300 dark:border-gray-600 pb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <button
                className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {faq.question}
                </h3>
                <svg
                  className={`h-5 w-5 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2 text-gray-700 dark:text-gray-300 pl-0">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-700 dark:text-gray-300">
            Still have questions?
          </p>
          <button 
            onClick={scrollToFooter} 
            className="mt-2 inline-flex items-center font-medium text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-500"
          >
            Contact us
            <svg className="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default FaqSection