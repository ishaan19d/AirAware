import axios from "axios";

function Step3Register({ name, setName, password, setPassword, phoneNumber, setPhoneNumber, email, setError }) {
  const registerUser = async () => {
    try {
      const response = await axios.post("http://localhost:8080/register-user", {
        email,
        name,
        password,
        phoneNumber,
      });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        alert("Registration successful!");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Name</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label className="block text-sm font-medium text-gray-700 mt-2">Password</label>
      <input
        type="password"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
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