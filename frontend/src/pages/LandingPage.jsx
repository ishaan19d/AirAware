import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AirParticlesAnimation from '../components/landing/AirParticlesAnimation'
import FeatureSection from '../components/landing/FeatureSection'
import PricingSection from '../components/landing/PricingSection'
import FaqSection from '../components/landing/FaqSection'

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const heroRef = useRef(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        // When we've scrolled past the hero section height, change navbar
        const scrollPosition = window.scrollY
        setIsScrolled(scrollPosition > heroRef.current.offsetHeight - 100)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar transparent={!isScrolled} />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-16 pb-32 flex content-center items-center justify-center"
        style={{ minHeight: '95vh' }}
      >
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-brand-700 to-brand-900 z-0">
          <AirParticlesAnimation />
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Breathe With Confidence
                </h1>
                <p className="mt-4 text-xl text-white/90">
                  Real-time air quality monitoring that keeps you informed and healthy.
                  Get alerts, personalized recommendations, and health insights.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Link 
                    to="/signup" 
                    className="btn px-8 py-3 bg-white text-brand-600 hover:bg-gray-100 hover:text-brand-700 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started
                  </Link>
                  <a 
                    href="#features" 
                    className="btn px-8 py-3 border-2 border-white/50 text-white hover:bg-white/10 text-lg font-medium rounded-lg transition-all duration-200"
                  >
                    Learn More
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <FeatureSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <FaqSection />
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage