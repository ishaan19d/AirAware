import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Bell, BarChart2, Brain, Globe2, Smartphone, ArrowRight, ArrowLeft, Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Instant air quality updates tailored to your exact location.",
      icon: <Wind className="w-8 h-8" />,
    },
    {
      title: "Personalized Alerts",
      description: "Customized notifications based on your health profile.",
      icon: <Bell className="w-8 h-8" />,
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive trend analysis and data visualization.",
      icon: <BarChart2 className="w-8 h-8" />,
    },
    {
      title: "Smart Recommendations",
      description: "AI-powered advice for better air quality decisions.",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      title: "Global Coverage",
      description: "Extensive monitoring across multiple regions worldwide.",
      icon: <Globe2 className="w-8 h-8" />,
    },
    {
      title: "Mobile Access",
      description: "Stay informed on the go with our mobile app.",
      icon: <Smartphone className="w-8 h-8" />,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1532054241088-402b4150db33?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Clean Air"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Breathe Smarter,<br />Live Healthier
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Get real-time air quality insights and personalized recommendations to protect your well-being.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup" className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors duration-300">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors duration-300">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to monitor and improve your air quality</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-cyan-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

          {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Plan</h3>
              <p className="text-gray-600 mb-6">Perfect for individual users</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Free</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="w-5 h-5 text-cyan-500 mr-2" />
                  Real-time air quality monitoring
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="w-5 h-5 text-cyan-500 mr-2" />
                  Basic alerts
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="w-5 h-5 text-cyan-500 mr-2" />
                  Daily reports
                </li>
              </ul>
              <Link to="/signup" className="block w-full text-center px-6 py-3 rounded-full bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors duration-300">
                Get Started
              </Link>
            </motion.div>
      
            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
              <p className="opacity-90 mb-6">Advanced features for health-conscious users</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹1500</span>
                <span className="opacity-90"> (one-time)</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Everything in Basic
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Personalized insights
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Health recommendations
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Priority support
                </li>
              </ul>
              <Link to="/signup" className="block w-full text-center px-6 py-3 rounded-full bg-white text-cyan-600 font-semibold hover:bg-gray-100 transition-colors duration-300">
                Get Premium
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">We're here to help you breathe easier</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Mail className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">support@airaware.com</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <Phone className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <MapPin className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">San Francisco, CA</p>
            </motion.div>
          </div>
          <div className="flex justify-center space-x-6 mt-12">
            <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors duration-300">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors duration-300">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors duration-300">
              <Facebook className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;