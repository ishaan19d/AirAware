import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../common/Navbar/Navbar";
import "./signup.css";

// Main Signup Component
function Signup() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();

  // Steps for the progress bar
  const steps = [
    { name: "Email", description: "Enter your email address" },
    { name: "Verify", description: "Enter the verification code" },
    { name: "Complete", description: "Complete your profile" }
  ];

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input if a digit was entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const getOtpString = () => otp.join("");

  const handleKeyDown = (index, e) => {
    // If backspace is pressed and current field is empty, focus previous field
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const resetErrors = () => {
    setError("");
  };

  return (
    <div className="signup-container">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="signup-card">
          {/* Progress Steps */}
          <div className="steps-container">
            {steps.map((s, i) => (
              <div key={i} className={`step ${i + 1 <= step ? "active" : ""}`}>
                <div className="step-circle">
                  {i + 1 < step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="step-label">
                  <span className="step-name">{s.name}</span>
                  <span className="step-description">{s.description}</span>
                </div>
                {i < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-container">
            {/* Step 1: Email */}
            {step === 1 && (
              <EmailStep 
                email={email} 
                setEmail={setEmail}
                setStep={setStep}
                setError={setError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                resetErrors={resetErrors}
                setResendTimer={setResendTimer}
                navigate={navigate}
              />
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <OtpStep
                email={email}
                otp={otp}
                handleOtpChange={handleOtpChange}
                handleKeyDown={handleKeyDown}
                getOtpString={getOtpString}
                setStep={setStep}
                setError={setError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                resetErrors={resetErrors}
                resendTimer={resendTimer}
                setResendTimer={setResendTimer}
              />
            )}

            {/* Step 3: Registration */}
            {step === 3 && (
              <RegisterStep
                name={name}
                setName={setName}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                email={email}
                setError={setError}
                navigate={navigate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                resetErrors={resetErrors}
                passwordStrength={passwordStrength}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Email Component
function EmailStep({ 
  email, 
  setEmail, 
  setStep, 
  setError, 
  isLoading, 
  setIsLoading, 
  resetErrors,
  setResendTimer,
  navigate 
}) {
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendOtp = async () => {
    resetErrors();
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post("http://localhost/api/send-otp", { email });
      setStep(2);
      setResendTimer(60); // Start 60 second timer for resending OTP
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-step">
      <h2 className="form-title">Create Your Account</h2>
      <p className="form-subtitle">Let's get started with your email</p>
      
      <div className="input-group">
        <label htmlFor="email" className="input-label">Email Address</label>
        <div className="input-container">
          <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendOtp()}
            required
          />
        </div>
      </div>
      
      <button
        onClick={sendOtp}
        disabled={isLoading || !email}
        className="primary-button"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sending...</span>
          </div>
        ) : (
          "Continue"
        )}
      </button>
      
      <div className="login-link">
        <p>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-link"
          >
            Log in
          </button>
        </p>
      </div>
      
      <div className="divider">
        <span>Or continue with</span>
      </div>
      
      <div className="social-buttons">
        <button className="social-button">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button className="social-button">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          Facebook
        </button>
      </div>
    </div>
  );
}

// Step 2: OTP Verification Component
function OtpStep({
  email,
  otp,
  handleOtpChange,
  handleKeyDown,
  getOtpString,
  setStep,
  setError,
  isLoading,
  setIsLoading,
  resetErrors,
  resendTimer,
  setResendTimer
}) {
  const verifyOtp = async () => {
    resetErrors();
    const otpString = getOtpString();
    
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post("http://localhost/api/verify-otp", { 
        email, 
        otp: otpString 
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    
    resetErrors();
    setIsLoading(true);
    
    try {
      await axios.post("http://localhost/api/send-otp", { email });
      setResendTimer(60);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to resend verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Focus the first OTP input when the component mounts
    const firstInput = document.getElementById("otp-0");
    if (firstInput) firstInput.focus();
  }, []);

  return (
    <div className="form-step">
      <h2 className="form-title">Verify Your Email</h2>
      <p className="form-subtitle">
        We've sent a verification code to <strong>{email}</strong>
      </p>
      
      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoComplete="off"
          />
        ))}
      </div>
      
      <button
        onClick={verifyOtp}
        disabled={isLoading || getOtpString().length !== 6}
        className="primary-button"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying...</span>
          </div>
        ) : (
          "Verify Code"
        )}
      </button>
      
      <button 
        onClick={resendOtp}
        disabled={resendTimer > 0 || isLoading}
        className="resend-button"
      >
        {resendTimer > 0 
          ? `Resend code in ${resendTimer}s` 
          : "Resend verification code"}
      </button>
      
      <button
        onClick={() => setStep(1)}
        className="back-button"
        disabled={isLoading}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Email
      </button>
    </div>
  );
}

// Step 3: Registration Component
function RegisterStep({
  name,
  setName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  phoneNumber,
  setPhoneNumber,
  email,
  setError,
  navigate,
  isLoading,
  setIsLoading,
  resetErrors,
  passwordStrength,
  showPassword,
  setShowPassword
}) {
  const validateForm = () => {
    resetErrors();
    
    if (!name.trim()) {
      setError("Please enter your name");
      return false;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (!/^\d{10,15}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return false;
    }
    
    return true;
  };

  const registerUser = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost/api/register-user", {
        email,
        name,
        password,
        phoneNumber,
      });

      console.log("Backend Response:", response);

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify({
          username: name,
          email: email
        }));
        
        setTimeout(() => {
          navigate("/free-dashboard");
        }, 1000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-step">
      <h2 className="form-title">Complete Your Profile</h2>
      <p className="form-subtitle">Just a few more details to get started</p>
      
      <div className="input-group">
        <label htmlFor="name" className="input-label">Full Name</label>
        <div className="input-container">
          <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <input
            id="name"
            type="text"
            className="input-field"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="input-group">
        <label htmlFor="password" className="input-label">Password</label>
        <div className="input-container">
          <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="input-field"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="password-strength">
          <div className="strength-bars">
            <div className={`strength-bar ${passwordStrength >= 1 ? "active" : ""}`}></div>
            <div className={`strength-bar ${passwordStrength >= 2 ? "active" : ""}`}></div>
            <div className={`strength-bar ${passwordStrength >= 3 ? "active" : ""}`}></div>
            <div className={`strength-bar ${passwordStrength >= 4 ? "active" : ""}`}></div>
          </div>
          <span className="strength-text">
            {passwordStrength === 0 && "Poor"}
            {passwordStrength === 1 && "Weak"}
            {passwordStrength === 2 && "Fair"}
            {passwordStrength === 3 && "Good"}
            {passwordStrength === 4 && "Strong"}
          </span>
        </div>
      </div>
      
      <div className="input-group">
        <label htmlFor="confirm-password" className="input-label">Confirm Password</label>
        <div className="input-container">
          <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            className="input-field"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="input-group">
        <label htmlFor="phone" className="input-label">Phone Number</label>
        <div className="input-container">
          <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <input
            id="phone"
            type="tel"
            className="input-field"
            placeholder="Your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ''))}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center mt-4">
        <input 
          id="terms" 
          type="checkbox" 
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </label>
      </div>
      
      <button
        onClick={registerUser}
        disabled={isLoading}
        className="primary-button"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Creating Account...</span>
          </div>
        ) : (
          "Create Account"
        )}
      </button>
    </div>
  );
}

export default Signup;