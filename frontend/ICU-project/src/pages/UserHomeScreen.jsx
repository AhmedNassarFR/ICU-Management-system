import React, { useState } from "react";
import Map from "../components/Map.jsx";
import Icus from "../components/Icus.jsx";
import styles from "./UserHomeScreen.module.css";
import { useParams } from "react-router-dom";

function UserHomeScreen() {
  const { id: doctorId } = useParams();
  const [specialization, setSpecialization] = useState(""); // State to hold the ICU specialization
  const [isPopupVisible, setIsPopupVisible] = useState(true); // State to control the popup visibility

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

  const handleSpecializationSubmit = (event) => {
    event.preventDefault();
    setIsPopupVisible(false); // Hide the popup after form submission
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
      ) : (
        <>
          <div className={styles.icus}>
            <Icus userId={doctorId} specialization={specialization} />
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
