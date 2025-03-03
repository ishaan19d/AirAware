import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import "./payment.css";

const plans = [
  {
    type: "Free",
    price: "₹ 0/month",
    features: ["Basic access", "Limited storage", "Email support"],
    tier: 1
  },
  {
    type: "Prime",
    price: "₹ 500/month",
    features: ["Dedicated account manager", "Custom integrations", "Advanced analytics"],
    tier: 2
  }
];

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
          const response = await axios.get("http://localhost:8000/accounts/me/", {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const fetchedUserData = response.data;
          setUserData(fetchedUserData);
          setCurrentPlan(parseInt(fetchedUserData.tier, 10));
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePayment = async (tier) => {
    if (tier === 1) {
      console.log("Free plan selected. No payment required.");
      return;
    }

    try {
      const accessToken = Cookies.get('accessToken');

      if (!accessToken) {
        console.error("No access token found. Please log in again.");
        return;
      }

      const response = await axios.post(
        "",
        { tier },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const data = response.data;

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "SalesSage",
        description: `Tier ${tier}`,
        image: "https://example.com/your_logo",
        order_id: data.order_id,
        callback_url: "",
        prefill: {
          name: "Harsh Choudhary",
          email: "harsh@gmail.com",
          contact: "9000090000"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error fetching order_id:', error);
    }
  };

  const getButtonText = (tier) => {
    if (!userData) return 'Buy Now';
    if (currentPlan === null) return 'Loading...';
    if (tier > currentPlan) return 'Upgrade';
    if (tier < currentPlan) return 'Downgrade';
    return 'Current Plan';
  };

  return (
    <div className="subscription-background" style={{ 
      backgroundImage: "url('src/assets/background.jpg')", 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat", 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      position: "relative" 
    }}>
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="max-w-6xl mx-auto p-8 relative z-10">
        <div className="flex items-center mb-8 md:mb-12">
          <h1 className="text-black text-3xl md:text-5xl font-bold mx-auto">Subscription Plans</h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group w-full md:w-1/3 rounded-3xl p-0.5 relative overflow-hidden shadow-xl transition duration-300 ${
                index === 0 ? 'border-t-4 border-r-2 border-b-1 border-opacity-80 border-blue-400' :
                index === 1 ? 'border-l-4 border-r-2 border-b-1 border-opacity-80 border-purple-500' : ''
              }`}
            >
              {/* Card background with better opacity for readability */}
              <div className="bg-gray-900 bg-opacity-80 h-full rounded-3xl flex flex-col justify-between group-hover:bg-opacity-90 transition-all duration-300">
                {/* Glow effect for premium tier */}
                {index === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
                )}
                <div className="p-8 relative z-10 text-white text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-blue-400 transition duration-300">{plan.type}</h2>
                  <p className="text-xl md:text-2xl mb-6">{plan.price}</p>
                  <ul className="space-y-2 text-left mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-8 font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 ${
                      !userData ? 'bg-blue-500 hover:bg-blue-600 text-white' : 
                      (currentPlan === plan.tier ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                    }`}
                    onClick={() => handlePayment(plan.tier)}
                    disabled={!userData || currentPlan === plan.tier}
                  >
                    {getButtonText(plan.tier)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;