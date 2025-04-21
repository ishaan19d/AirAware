import { createContext, useState, useEffect } from 'react'
import { loginUser, signupUser, verifyOtp, getUserProfile, logoutUser } from '../services/auth'
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token) {
      // Fetch user profile when a token exists
      loadUserProfile()
    } else {
      setLoading(false)
    }
  }, [])
  
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userMeta = JSON.parse(localStorage.getItem('userMeta'));
      if (userMeta) {
        setUser(userMeta); // Use userMeta from local storage
        setIsAuthenticated(true);
      } else {
        const userData = await getUserProfile(); // Fallback to API call if userMeta is not available
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userMeta', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('userMeta');
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials, rememberMe) => {
    try {
      setLoading(true)
      setError(null)
      
      const { token } = await loginUser(credentials)
      
      // Decode the JWT token to extract user metadata
      const payload = jwtDecode(token)

      // Store the token and user metadata in local storage
      localStorage.setItem('token', token)
      localStorage.setItem(
        'userMeta',
        JSON.stringify({
          name: payload.name,
          email: payload.sub,
          isPremiumUser: payload.isPremiumUser,
          phoneNumber: payload.phoneNumber,
          diseases: payload.diseases || [], // Store diseases from the JWT
          location: payload.location || {},
          issuedAt: payload.iat,
          expiresAt: payload.exp,
        })
      )
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      setUser(payload) // Set user data from the decoded token
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }
  
  const signup = async (userData, step) => {
    try {
      setLoading(true);
      setError(null);
  
      const result = await signupUser(userData, step);
  
      if (result.success && step === 3) {
        // Decode the JWT token to extract user metadata
        const payload = jwtDecode(result.token);
  
        // Store the token and user metadata in local storage
        localStorage.setItem('token', result.token);
        localStorage.setItem(
          'userMeta',
          JSON.stringify({
            name: payload.name,
            email: payload.sub,
            isPremiumUser: payload.isPremiumUser,
            phoneNumber: payload.phoneNumber,
            issuedAt: payload.iat,
            expiresAt: payload.exp,
          })
        );
  
        setUser(payload); // Set user data from the decoded token
        setIsAuthenticated(true);
      }
  
      return result; // Return the result to handle steps in the UI
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  const verifyEmail = async (email, otp) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await verifyOtp({ email, otp })
      return { success: true, data: response }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP. Please try again.')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }
  
  const completeSignup = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      // This would typically call an API endpoint to complete registration with user details
      const { token } = await signupUser(userData, true) // Second parameter indicates final step
      
      // Decode the JWT token to extract user metadata
      const payload = jwtDecode(token);

      // Store the token and user metadata in local storage
      localStorage.setItem('token', token);
      localStorage.setItem(
        'userMeta',
        JSON.stringify({
          name: payload.name,
          email: payload.sub,
          isPremiumUser: payload.isPremiumUser,
          phoneNumber: payload.phoneNumber,
          issuedAt: payload.iat,
          expiresAt: payload.exp,
        })
      );

      setUser(payload); // Set user data from the decoded token
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to complete sign up. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('userMeta');
    localStorage.removeItem('rememberMe');
    setUser(null);
    setIsAuthenticated(false);
    logoutUser().catch(console.error); // Optional server-side logout
  };
  
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    verifyEmail,
    completeSignup,
    logout
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}