import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PatientHomePage.module.css"; // Importing the CSS module

function PatientHomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false); // To toggle the invoice popup

  useEffect(() => {
    if (!userId) {
      setError("User ID is not available.");
      setLoading(false);
      return;
    }

    const fetchPatientDetails = async () => {
      try {
        console.log("Fetching data for userId:", userId);
        const response = await fetch(
          `http://localhost:3030/user/details/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch patient details.");
        }
        const data = await response.json();
        console.log("Fetched patient data:", data);

        setPatientDetails(data.user);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Failed to load patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [userId]);

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login"); // Redirect to login page after logout
  };

  // Handle Pay button click
  const handlePay = () => {
    // Close the invoice popup after payment is confirmed
    setShowInvoicePopup(false);

    // Navigate back to UserHomeScreen
    navigate(`/Home/${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!patientDetails) {
    return <div>No patient data available.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Welcome, {patientDetails.firstName}</h1>
      <div className={styles.patientInfo}>
        <h2>Patient Details</h2>
        <div className={styles.detail}>
          <strong>First Name:</strong> {patientDetails.firstName}
        </div>
        <div className={styles.detail}>
          <strong>Last Name:</strong> {patientDetails.lastName}
        </div>
        <div className={styles.detail}>
          <strong>Gender:</strong> {patientDetails.gender}
        </div>
        <div className={styles.detail}>
          <strong>Email:</strong> {patientDetails.email}
        </div>
        <div className={styles.detail}>
          <strong>Phone:</strong> {patientDetails.phone}
        </div>
        <div className={styles.detail}>
          <strong>Role:</strong> {patientDetails.role}
        </div>
        <div className={styles.detail}>
          <strong>Current Condition:</strong> {patientDetails.currentCondition}
        </div>
        <div className={styles.detail}>
          <strong>Medical History:</strong> {patientDetails.medicalHistory}
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => setShowInvoicePopup(true)}
        className={styles.checkoutButton}
      >
        Proceed to Checkout
      </button>

      {/* Invoice Popup */}
      {showInvoicePopup && (
        <div className={styles.invoicePopup}>
          <div className={styles.popupContent}>
            <h2>Invoice</h2>
            <p>
              <strong>Patient Name:</strong> {patientDetails.firstName}{" "}
              {patientDetails.lastName}
            </p>
            <p>
              <strong>Hospital:</strong> XYZ Hospital
            </p>
            <p>
              <strong>Total Amount:</strong> $500
            </p>{" "}
            {/* You can replace $500 with the actual payment amount */}
            <div className={styles.popupButtons}>
              <button onClick={handlePay} className={styles.payButton}>
                Pay
              </button>
              <button
                onClick={() => setShowInvoicePopup(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

export default PatientHomePage;
