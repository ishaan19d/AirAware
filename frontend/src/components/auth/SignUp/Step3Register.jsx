import axios from "axios";

function Step3Register({
  name,
  setName,
  password,
  setPassword,
  phoneNumber,
  setPhoneNumber,
  email,
  setError,
  navigate,
}) {
  const registerUser = async () => {
    try {
      const response = await axios.post("http://localhost:8080/register-user", {
        email,
        name,
        password,
        phoneNumber,
      });

      console.log("Backend Response:", response); // Log the response for debugging

      // Check if the response status is 201 (Created)
      if (response.status === 201 || response.status === 200) {
        alert("Registration successful!");
        navigate("/free-dashboard"); // Redirect to the dashboard
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration Error:", err); // Log the error for debugging
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      <button
        onClick={registerUser}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-2"
      >
        Register
      </button>
    </div>
  );
}

export default Step3Register;