import React, { useState } from "react";
import axios from "axios";
import "./Loginform.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "Patient", // Default role
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Clear previous error messages
    setSuccessMessage(""); // Clear previous success messages

    try {
      // Sending login data to the backend
      const response = await axios.post(
        "http://localhost:3030/user/login-user",
        formData
      );

      // If successful, store the token
      localStorage.setItem("authToken", response.data.token); // Save the token in localStorage
      setSuccessMessage("Login successful! Redirecting...");

      // Optionally, redirect user to another page after login
      // window.location.href = "/dashboard"; // You can redirect after successful login
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
    }
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
        <button type="submit">Login</button>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Success Message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
