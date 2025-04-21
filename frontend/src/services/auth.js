import api from './api'
import axios from 'axios';

// Mock API responses for demonstration purposes
// In a real application, these would make actual API calls

export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post(
      "http://localhost/api/login-user",
      { username: credentials.email, password: credentials.password }
    );

    // Store user info in local storage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export const signupUser = async (userData, isFinalStep = false) => {
  try {
    // In step 1, just send email
    if (!isFinalStep) {
      // In a real app: return await api.post('/auth/signup/email', userData)
      
      // Mock response - would just return success in real app
      return { success: true }
    }
    
    // In final step, send all user data and get back token + user
    // In a real app: return await api.post('/auth/signup/complete', userData)
    
    // Mock response for final step
    return {
      token: 'mock_jwt_token_' + Math.random(),
      user: {
        id: '1',
        name: userData.name,
        email: userData.email,
        plan: 'free'
      }
    }
  } catch (error) {
    throw error
  }
}

export const verifyOtp = async ({ email, otp }) => {
  try {
    // In a real app: return await api.post('/auth/signup/verify', { email, otp })
    
    // Mock verification - in real app would verify OTP
    if (otp === '123456') {
      return { success: true, email }
    } else {
      throw new Error('Invalid OTP code')
    }
  } catch (error) {
    throw error
  }
}

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get("http://localhost/api/user-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data; // Return user data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
}

export const logoutUser = async () => {
  try {
    // In a real app: return await api.post('/auth/logout')
    
    // Mock response
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    // We still want to clear local state even if server logout fails
  }
}

export const upgradeUserToPro = async () => {
  try {
    // In a real app: return await api.post('/user/upgrade')
    
    // Mock response
    return { 
      success: true,
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        plan: 'pro'
      }
    }
  } catch (error) {
    throw error
  }
}