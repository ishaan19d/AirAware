import { useContext, useState, useEffect } from 'react'
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
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0) // 0: hidden, 1: email, 2: OTP, 3: new password
  const [forgotEmail, setForgotEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm()
  
  // Check if redirected due to expired session
  const isExpired = new URLSearchParams(location.search).get('expired') === 'true'
  
  // If session expired, show a toast
  useEffect(() => {
    if (isExpired) {
      addToast('Your session has expired. Please login again.', 'info')
    }
  }, [isExpired, addToast])
  
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

  // Handle forgot password email submission
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      addToast('Please enter your email address', 'error')
      return
    }

    try {
      setIsSubmittingForgot(true)
      const response = await fetch('http://localhost/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      })

      if (response.status === 404) {
        addToast('Email not found. Please check your email address.', 'error')
      } else if (response.ok) {
        addToast('OTP sent to your email address', 'success')
        setForgotPasswordStep(2) // Move to OTP verification step
      } else {
        addToast('Something went wrong. Please try again later.', 'error')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      addToast('An unexpected error occurred', 'error')
    } finally {
      setIsSubmittingForgot(false)
    }
  }

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (!otp) {
      addToast('Please enter the OTP sent to your email', 'error')
      return
    }

    try {
      setIsSubmittingForgot(true)
      const response = await fetch('http://localhost/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail, otp }),
      })

      if (response.ok) {
        addToast('OTP verified successfully', 'success')
        setForgotPasswordStep(3) // Move to password reset step
      } else {
        addToast('Invalid OTP. Please try again.', 'error')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      addToast('An unexpected error occurred', 'error')
    } finally {
      setIsSubmittingForgot(false)
    }
  }

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }

    try {
      setIsSubmittingForgot(true)
      const response = await fetch('http://localhost/api/reset-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotEmail, 
          password: newPassword  // Changed to 'password' as that's what the API expects
        }),
      })

      if (response.ok) {
        addToast('Password reset successful! Please login with your new password.', 'success')
        setForgotPasswordStep(0) // Back to login form
        setForgotEmail('')
        setOtp('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        addToast('Failed to reset password. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      addToast('An unexpected error occurred', 'error')
    } finally {
      setIsSubmittingForgot(false)
    }
  }

  // Helper to close forgot password modal and reset state
  const closeForgotPassword = () => {
    setForgotPasswordStep(0)
    setForgotEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
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
            
            {forgotPasswordStep === 0 ? (
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
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="input w-full pr-10"
                      placeholder="Enter your password"
                      {...register('password', { required: 'Password is required' })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                    <button 
                      type="button"
                      className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      onClick={() => setForgotPasswordStep(1)}
                    >
                      Forgot password?
                    </button>
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
            ) : (
              <div className="forgot-password-container">
                {/* Email step */}
                {forgotPasswordStep === 1 && (
                  <form onSubmit={handleForgotEmailSubmit}>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Forgot Password</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Enter your email address and we'll send you an OTP to reset your password.</p>
                    
                    <div className="mb-4">
                      <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        className="input w-full"
                        placeholder="name@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 rounded-md"
                        onClick={closeForgotPassword}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary px-4 py-2 rounded-md"
                        disabled={isSubmittingForgot}
                      >
                        {isSubmittingForgot ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* OTP step */}
                {forgotPasswordStep === 2 && (
                  <form onSubmit={handleOtpSubmit}>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Verify OTP</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Enter the OTP sent to your email address.</p>
                    
                    <div className="mb-4">
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        className="input w-full"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 rounded-md"
                        onClick={closeForgotPassword}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary px-4 py-2 rounded-md"
                        disabled={isSubmittingForgot}
                      >
                        {isSubmittingForgot ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Password reset step */}
                {forgotPasswordStep === 3 && (
                  <form onSubmit={handleResetPassword}>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Reset Password</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Enter your new password.</p>
                    
                    <div className="mb-4">
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          className="input w-full pr-10"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        className="input w-full"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 rounded-md"
                        onClick={closeForgotPassword}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary px-4 py-2 rounded-md"
                        disabled={isSubmittingForgot}
                      >
                        {isSubmittingForgot ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default LoginPage