import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Loginform.css";

const MAX_ATTEMPTS = 3; // Set maximum allowed login attempts
const LOCKOUT_TIME = 30000; // Lockout time in milliseconds (e.g., 30 seconds)

const LoginForm = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "Patient",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Lockout timer
  const startLockoutTimer = () => {
    setIsLockedOut(true);
    setTimeout(() => {
      setLoginAttempts(0); // Reset attempts after lockout time
      setIsLockedOut(false);
    }, LOCKOUT_TIME);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLockedOut) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3030/user/login-user",
        formData
      );

      // If successful and status is 200
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token); // Save the token
        setSuccessMessage("Login successful! Redirecting...");
        setLoginAttempts(0); // Reset attempts after successful login
        navigate("/icu"); // Redirect to ICU page
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");

      // Increment login attempts on failure
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Lockout logic
      if (newAttempts >= MAX_ATTEMPTS) {
        startLockoutTimer();
        setError("Too many failed attempts. Please try again later.");
      }
    }
  };

  // Navigate to Register Page
  const handleRegisterRedirect = () => {
    navigate("/register"); // Redirect to /register
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            disabled={isLockedOut}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLockedOut}
          />
        </div>

        {/* Role Dropdown */}
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={isLockedOut}
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Manager">Manager</option>
            <option value="Nurse">Nurse</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLockedOut}>
          Login
        </button>
        <span className="account-message">Already have an acoount?</span>
        {/* Register Button */}
        <button
          type="button"
          className="register-button"
          onClick={handleRegisterRedirect}
        >
          Register
        </button>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Success Message */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Lockout Info */}
        {isLockedOut && (
          <p className="lockout-message">
            You are locked out for {LOCKOUT_TIME / 1000} seconds.
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
