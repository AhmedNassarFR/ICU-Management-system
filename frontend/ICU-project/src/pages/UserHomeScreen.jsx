import React, { useState } from "react";
import axios from "axios";
import styles from "./UserHomeScreen.module.css";
import Icus from "../components/Icus";
import Map from "../components/Map";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function UserHomeScreen() {
  const { id: userId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook to programmatically navigate
  const [specialization, setSpecialization] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [isSecondPopupVisible, setIsSecondPopupVisible] = useState(false);
  const [currentCondition, setCurrentCondition] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  const specializationOptions = [
    "Medical ICU",
    "Surgical ICU",
    "Cardiac ICU",
    "Neonatal ICU",
    "Pediatric ICU",
    "Neurological ICU",
    "Trauma ICU",
    "Burn ICU",
    "Respiratory ICU",
    "Coronary Care Unit",
    "Oncology ICU",
    "Transplant ICU",
    "Geriatric ICU",
    "Post-Anesthesia Care Unit",
    "Obstetric ICU",
    "Infectious Disease ICU",
  ];

  const handleSpecializationSubmit = (e) => {
    e.preventDefault();
    setIsPopupVisible(false);
  };

  const handleOpenSecondPopup = () => {
    setIsSecondPopupVisible(true);
  };

  const handleSecondPopupSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to the backend using the updateUser function
      await axios.put(
        `http://localhost:3030/user/${userId}/update-medical-details`,
        {
          currentCondition,
          medicalHistory,
        }
      );
      alert("Medical details updated successfully!");
      setIsSecondPopupVisible(false); // Close the popup after success

      // Navigate to the PatientHomePage after successful submission
      navigate(`/PatientProfile/${userId}`, {
        state: { userId }, // Passing the userId as state to the next page
      });
    } catch (error) {
      console.error("Error updating medical details:", error);
      alert("Failed to update medical details. Please try again.");
    }
  };

  return (
    <div className={styles.userHomeContainer}>
      {isPopupVisible ? (
        <div className={styles.popupContainer}>
          <div className={styles.popupBox}>
            <h2>Select Your ICU Specialization</h2>
            <form onSubmit={handleSpecializationSubmit}>
              <label>
                ICU Specialization:
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  className={styles.select}
                >
                  <option value="" disabled>
                    Select a specialization
                  </option>
                  {specializationOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : isSecondPopupVisible ? (
        <div className={styles.popupContainer}>
          <div className={styles.popupBox}>
            <h2>Update Medical Details</h2>
            <form onSubmit={handleSecondPopupSubmit}>
              <label>
                Current Condition:
                <textarea
                  value={currentCondition}
                  onChange={(e) => setCurrentCondition(e.target.value)}
                  className={styles.textArea}
                  required
                />
              </label>
              <label>
                Medical History (Optional):
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className={styles.textArea}
                />
              </label>
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsSecondPopupVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.icus}>
            <Icus
              userId={userId}
              specialization={specialization}
              onReserveICU={handleOpenSecondPopup}
            />
          </div>
          <div className={styles.map}>
            <Map />
          </div>
        </>
      )}
    </div>
  );
}

export default UserHomeScreen;
