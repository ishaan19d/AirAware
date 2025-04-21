import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ToastContext } from '../context/ToastContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const proFeatures = [
  'Detailed pollutant analysis',
  'Weekly & monthly forecasts',
  'Priority alerts',
  'Multiple location monitoring',
  'Personalized health recommendations',
  'Historical data analysis',
  'Custom alert thresholds',
  'Health condition tracking',
  'Personalized impact assessments',
]

const SubscriptionPage = () => {
  const { user, logout } = useContext(AuthContext)
  const { addToast } = useContext(ToastContext)
  const navigate = useNavigate()
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [status, setStatus] = useState('')

  const amount = '1500' // Fixed amount for lifetime subscription

  const handlePayment = async () => {
    setPaymentProcessing(true)
    setStatus('Creating order...')

    try {
      // Create order
      const orderResponse = await fetch(`http://localhost/api/payment-gateway/create-order?amount=${amount}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order: ' + orderResponse.statusText)
      }

      const orderData = await orderResponse.json()
      setStatus('Order created successfully. Opening payment form...')

      // Load Razorpay SDK
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: 'rzp_test_0EQMDqroOyLvid',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'AirAware Premium',
          description: 'Lifetime Premium Subscription',
          order_id: orderData.id,
          handler: async function (response) {
            setStatus('Payment completed. Verifying...')

            try {
              // Verify payment
              const verifyResponse = await fetch(
                `http://localhost/api/payment-gateway/verify?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}&signature=${response.razorpay_signature}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              )

              if (!verifyResponse.ok) {
                throw new Error('Verification failed: ' + verifyResponse.statusText)
              }

              const verifyData = await verifyResponse.text()
              console.log('Verification response:', verifyData)

              if (verifyResponse.status === 200) {
                setStatus('Payment verified! Logging you out...')

                // Instead of manually clearing localStorage, use the logout function
                logout();
                
                addToast('Payment successful! Welcome to AirAware Pro. Please log in again to access your upgraded account.', 'success')
                setTimeout(() => {
                  navigate('/login')
                }, 2000)
              } else {
                setStatus('Payment verification failed!')
                addToast('Payment verification failed. Please try again.', 'error')
              }
            } catch (error) {
              setStatus(`Verification Error: ${error.message}`)
              addToast('An error occurred during payment verification.', 'error')
            }
          },
          prefill: {
            name: user?.name || 'AirAware User',
            email: localStorage.getItem('userEmail') || 'user@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#3a7bd5'
          },
          modal: {
            ondismiss: function () {
              setPaymentProcessing(false)
            }
          }
        }

        const razorpay = new window.Razorpay(options)

        razorpay.on('payment.failed', function () {
          setStatus('Payment failed')
          addToast('Payment failed. Please try again.', 'error')
          setPaymentProcessing(false)
        })

        razorpay.open()
      }

      script.onerror = () => {
        setStatus('Failed to load Razorpay SDK')
        addToast('Failed to load payment gateway. Please try again.', 'error')
        setPaymentProcessing(false)
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`)
      addToast('An error occurred while processing payment.', 'error')
      setPaymentProcessing(false)
    }
  }

  if (user?.isPremiumUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">You're already a Pro user!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You already have access to all premium features of AirAware.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 btn-primary w-full py-2 px-4 rounded-md"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upgrade to AirAware Pro</h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Get comprehensive air quality insights and personalized health recommendations
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">One-Time Payment</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">₹1,500</span>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full py-3 px-4 rounded-md bg-brand-600 text-white hover:bg-brand-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {paymentProcessing ? 'Processing...' : 'Upgrade Now'}
              </button>
              {status && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">{status}</div>
              )}
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
              Why Choose Pro?
            </h2>
            <ul className="space-y-4">
              {proFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <svg
                    className="h-6 w-6 text-brand-600 flex-shrink-0 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SubscriptionPage