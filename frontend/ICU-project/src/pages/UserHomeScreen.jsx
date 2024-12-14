// src/pages/UserHomeScreen.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import styles from "./UserHomeScreen.module.css";
import Icus from "../components/Icus";
import Map from "../components/Map";

function UserHomeScreen() {
  const { id: userId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [specialization, setSpecialization] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(true);

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

  // const handleOpenSecondPopup = () => {
  //   navigate(`/update-medical-details/${userId}`); // Navigate to the new page for updating medical details
  // };

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
            <Icus userId={userId} specialization={specialization} />
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
