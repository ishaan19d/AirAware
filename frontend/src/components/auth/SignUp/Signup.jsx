import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Step1Email from "./Step1Email";
import Step2OTP from "./Step2OTP";
import Step3Register from "./Step3Register";
import ProgressBar from "../../common/ProgressBar/Progressbar"; // Import ProgressBar
import "./signup.css";
import Navbar from "../../common/Navbar/Navbar";

function Signup() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Steps for the progress bar
  const steps = ["Email", "OTP", "Register"];

  return (
    <div className="signup-background">
      <Navbar />
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-96 mt-16">
        {/* Progress Bar */}
        <ProgressBar steps={steps} currentStep={step} />

        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {step === 1 && (
          <Step1Email
            email={email}
            setEmail={setEmail}
            setStep={setStep}
            setError={setError}
          />
        )}

        {step === 2 && (
          <Step2OTP
            email={email}
            otp={otp}
            setOtp={setOtp}
            setStep={setStep}
            setError={setError}
          />
        )}

        {step === 3 && (
          <Step3Register
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            email={email}
            setError={setError}
            navigate={navigate} // Pass navigate to Step3Register
          />
        )}
      </div>
    </div>
  );
}

export default Signup;