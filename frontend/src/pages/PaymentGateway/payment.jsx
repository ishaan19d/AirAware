import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Clock } from 'lucide-react';
import Cookies from 'js-cookie';

// Add Razorpay to window object
window.Razorpay = window.Razorpay || {};

function App() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!amount) return;
    
    setLoading(true);
    setStatus('Creating order...');
    
    try {
      // Create order
      const orderResponse = await fetch(`http://localhost/api/payment-gateway/create-order?amount=${amount}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // credentials: 'include' // This is important for sending cookies
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order: ' + orderResponse.statusText);
      }

      const orderData = await orderResponse.json();
      setResponse(`Order Created:\n${JSON.stringify(orderData, null, 2)}`);
      setStatus('Order created successfully. Opening payment form...');

      // Load Razorpay SDK
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_test_0EQMDqroOyLvid',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Test Company',
          description: 'Test Transaction',
          order_id: orderData.id,
          handler: async function(response) {
            setStatus('Payment completed. Verifying...');

            try {
              // Get JWT token from cookies
              const jwtToken = Cookies.get('access_token');

              // Verify payment
              const verifyResponse = await fetch(
                `http://localhost/api/payment-gateway/verify?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}&signature=${response.razorpay_signature}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                  },
                  // credentials: 'include' // Include cookies in the request
                }
              );

              if (!verifyResponse.ok) {
                throw new Error('Verification failed: ' + verifyResponse.statusText);
              }

              const verifyData = await verifyResponse.text();
              
              if (verifyData === 'Payment Verified and User Marked as Premium') {
                setStatus('✅ Payment verified and user marked as premium!');
                navigate('/premium-dashboard'); // Navigate to premium dashboard
              } else {
                setStatus('❌ Payment verification failed!');
              }

              setResponse(prev => `${prev}\n\nVerification Result:\n${verifyData}\n\nPayment Details:\nOrder ID: ${response.razorpay_order_id}\nPayment ID: ${response.razorpay_payment_id}\nSignature: ${response.razorpay_signature}`);
            } catch (error) {
              setStatus(`❌ Verification Error: ${error.message}`);
              console.error('Verification Error:', error);
            }
          },
          prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9999999999'
          },
          notes: {
            address: 'Test Address'
          },
          theme: {
            color: '#6366F1'
          }
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function(response) {
          setStatus('❌ Payment failed');
          setResponse(prev => `${prev}\n\nPayment Failed:\nError Code: ${response.error.code}\nError Description: ${response.error.description}\nError Source: ${response.error.source}\nError Step: ${response.error.step}\nError Reason: ${response.error.reason}`);
        });

        razorpay.open();
      };

      script.onerror = () => {
        setStatus('❌ Failed to load Razorpay SDK');
        setLoading(false);
      };
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      setResponse(`Error: ${error.message}`);
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Secure Payment
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fast, secure, and reliable payment processing
          </p>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                <CreditCard className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Secure Payment</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Protected</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="mt-2 text-sm text-gray-500">24/7 Support</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (INR)
              </label>
              <div className="mt-1">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {status && (
              <div className={`p-3 rounded-md ${
                status.includes('❌') ? 'bg-red-50 text-red-700' :
                status.includes('✅') ? 'bg-green-50 text-green-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {status}
              </div>
            )}

            {response && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <pre className="text-sm whitespace-pre-wrap break-words">
                  {response}
                </pre>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={!amount || loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : `Pay ₹${amount || '0'}`}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Secured by Razorpay Payment Gateway</p>
        </div>
      </div>
    </div>
  );
}

export default App;