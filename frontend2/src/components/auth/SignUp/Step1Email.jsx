import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Step1Email({ email, setEmail, setStep, setError }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:8080/send-otp", { email });
      setStep(2); // Move to Step 2
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        onClick={sendOtp}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
      >
        Send OTP
      </button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")} // Redirect to login page
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Step1Email;