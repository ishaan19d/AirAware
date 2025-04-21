import { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { AuthContext } from '../context/AuthContext'
import { ToastContext } from '../context/ToastContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const LoginPage = () => {
  const { login } = useContext(AuthContext)
  const { addToast } = useContext(ToastContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [rememberMe, setRememberMe] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm()
  
  // Check if redirected due to expired session
  const isExpired = new URLSearchParams(location.search).get('expired') === 'true'
  
  // If session expired, show a toast
  if (isExpired) {
    addToast('Your session has expired. Please login again.', 'info')
  }
  
  const onSubmit = async (data) => {
    try {
      const result = await login(data, rememberMe)
      
      if (result.success) {
        addToast('Login successful!', 'success')
        navigate('/dashboard')
      } else {
        addToast(result.error || 'Invalid credentials. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      addToast('An unexpected error occurred', 'error')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex min-h-screen py-16">
        <div className="container mx-auto max-w-md px-4">
          <motion.div 
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Sign in to access your AirAware dashboard
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input w-full"
                  placeholder="name@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="input w-full"
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <a 
                    href="#" 
                    className="text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-2 px-4 rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
              
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default LoginPage