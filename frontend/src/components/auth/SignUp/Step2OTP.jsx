import axios from "axios";

function Step2OTP({ email,otp, setOtp, setStep, setError }) {
  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:8080/verify-otp", { email, otp });
      setStep(3); // Move to Step 3
    } catch (err) {
      console.log(err);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">OTP</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button
        onClick={verifyOtp}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-2"
      >
        Verify OTP
      </button>
    </div>
  );
}

export default Step2OTP;