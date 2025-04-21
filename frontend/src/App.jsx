import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRouteGuard from './components/common/PublicRouteGuard'
import LoadingScreen from './components/common/LoadingScreen'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'))

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Protected routes (requires authentication) */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/subscription" 
                  element={
                    <ProtectedRoute>
                      <SubscriptionPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Public routes (redirects to dashboard if already logged in) */}
                <Route 
                  path="/" 
                  element={
                    <PublicRouteGuard>
                      <LandingPage />
                    </PublicRouteGuard>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRouteGuard>
                      <SignUpPage />
                    </PublicRouteGuard>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <PublicRouteGuard>
                      <LoginPage />
                    </PublicRouteGuard>
                  } 
                />
                
                {/* Fallback route for any other path */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App