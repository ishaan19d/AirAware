import { useState, useContext, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../context/AuthContext'
import { ToastContext } from '../context/ToastContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import axios from 'axios'

const SignUpPage = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const { signup, verifyEmail, completeSignup } = useContext(AuthContext)
  const { addToast } = useContext(ToastContext)
  const navigate = useNavigate()
  
  // Step 1: Email form
  const { 
    register: registerStep1, 
    handleSubmit: handleSubmitStep1, 
    formState: { errors: errorsStep1, isSubmitting: isSubmittingStep1 } 
  } = useForm()
  
  // Step 2: OTP verification
  const { 
    register: registerStep2, 
    handleSubmit: handleSubmitStep2, 
    formState: { errors: errorsStep2, isSubmitting: isSubmittingStep2 } 
  } = useForm()
  
  // Step 3: Complete profile
  const { 
    register: registerStep3, 
    handleSubmit: handleSubmitStep3, 
    formState: { errors: errorsStep3, isSubmitting: isSubmittingStep3 }
  } = useForm()
  
  const onSubmitStep1 = async (data) => {
    try {
      await axios.post("http://localhost/api/send-otp", { email: data.email });
      setEmail(data.email);
      
      setStep(2);
      addToast('Verification code sent to your email', 'success');

    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      if (error.response?.status === 409) {
        addToast('Email already exists. Please log in.', 'error');
      } else {
        addToast(errorMessage, 'error');
      }
    }
  };

  const onSubmitStep2 = async (data) => {
    try {
      await axios.post("http://localhost/api/verify-otp", { email, otp: data.otp });
      setStep(3);
      addToast('Email verified successfully', 'success');
    } catch (error) {
      console.error('Verify OTP error:', error);
      addToast(error.response?.data?.message || 'Invalid verification code', 'error');
    }
  };

  const onSubmitStep3 = async (data) => {
    try {
      const response = await axios.post("http://localhost/api/register-user", {
        email,
        name: data.name,
        password: data.password,
        phoneNumber: data.phoneNumber,
      });
      addToast('Account created successfully!', 'success');
      navigate('/dashboard'); // Redirect to dashboard after signup
    } catch (error) {
      console.error('Register user error:', error);
      addToast(error.response?.data?.message || 'Failed to complete sign up', 'error');
    }
  };

  const renderStepContent = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Get Started with AirAware</h2>
            <form onSubmit={handleSubmitStep1(onSubmitStep1)}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input w-full"
                  placeholder="name@example.com"
                  {...registerStep1('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errorsStep1.email && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep1.email.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-2 px-4 rounded-md"
                disabled={isSubmittingStep1}
              >
                {isSubmittingStep1 ? 'Sending...' : 'Continue'}
              </button>
              
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
                  Log in
                </Link>
              </p>
            </form>
          </motion.div>
        )
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Verify Your Email</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a verification code to <span className="font-medium">{email}</span>
            </p>
            
            <form onSubmit={handleSubmitStep2(onSubmitStep2)}>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  className="input w-full"
                  placeholder="Enter the 6-digit code"
                  {...registerStep2('otp', { 
                    required: 'Verification code is required',
                    minLength: {
                      value: 6,
                      message: 'Code must be 6 digits'
                    },
                    maxLength: {
                      value: 6,
                      message: 'Code must be 6 digits'
                    }
                  })}
                />
                {errorsStep2.otp && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep2.otp.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-2 px-4 rounded-md"
                disabled={isSubmittingStep2}
              >
                {isSubmittingStep2 ? 'Verifying...' : 'Verify'}
              </button>
              
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                Didn't receive a code?{' '}
                <button
                  type="button"
                  className="text-brand-600 hover:text-brand-700 font-medium"
                  onClick={() => handleSubmitStep1({ email })}
                >
                  Resend
                </button>
              </p>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setStep(1)}
                >
                  Back to email
                </button>
              </p>
            </form>
          </motion.div>
        )
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Complete Your Profile</h2>
            
            <form onSubmit={handleSubmitStep3(onSubmitStep3)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="input w-full"
                  placeholder="Enter your name"
                  {...registerStep3('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                />
                {errorsStep3.name && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep3.name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  className="input w-full"
                  placeholder="Enter your phone number"
                  {...registerStep3('phoneNumber', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Invalid phone number. Must be a valid 10-digit Indian phone number.'
                    }
                  })}
                />
                {errorsStep3.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep3.phoneNumber.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="input w-full"
                  placeholder="Create a password"
                  {...registerStep3('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />
                {errorsStep3.password && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep3.password.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  className="input w-full"
                  placeholder="Confirm your password"
                  {...registerStep3('passwordConfirm', { 
                    required: 'Please confirm your password',
                    validate: (value, formValues) => value === formValues.password || 'Passwords do not match'
                  })}
                />
                {errorsStep3.passwordConfirm && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep3.passwordConfirm.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-2 px-4 rounded-md"
                disabled={isSubmittingStep3}
              >
                {isSubmittingStep3 ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        )
        
      default:
        return null
    }
  }, [step, email, registerStep1, registerStep2, registerStep3, handleSubmitStep1, handleSubmitStep2, 
       errorsStep1, errorsStep2, errorsStep3, isSubmittingStep1, isSubmittingStep2, isSubmittingStep3])
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex min-h-screen py-16">
        <div className="container mx-auto max-w-md px-4">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            {/* Step Progress */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= item 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step > item ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      item
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    {item === 1 && 'Email'}
                    {item === 2 && 'Verify'}
                    {item === 3 && 'Details'}
                  </span>
                </div>
              ))}
            </div>
            
            {renderStepContent()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default SignUpPage