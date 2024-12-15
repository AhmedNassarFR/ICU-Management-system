import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./UserHomeScreen.module.css";
import Icus from "../components/Icus";
import Map from "../components/Map";

function UserHomeScreen() {
  const { id: userId } = useParams();
  const [specialization, setSpecialization] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [icus, setICUs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchLocationAndICUs = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              setLoading(true);
              const response = await axios.get(
                "http://localhost:3030/patient/get-available-icus",
                {
                  params: {
                    userLocation: `${longitude},${latitude}`,
                  },
                }
              );
              setICUs(response.data.icus || []);
            } catch (err) {
              console.error("Error fetching ICUs:", err);
              setError("Unable to fetch ICUs. Please try again later.");
            } finally {
              setLoading(false);
            }
          },
          (err) => {
            console.error("Error fetching location:", err.message);
            const errorMessages = {
              [err.PERMISSION_DENIED]:
                "Location access was denied. Please enable location permissions.",
              [err.POSITION_UNAVAILABLE]:
                "Location information is unavailable.",
              [err.TIMEOUT]: "The request to get your location timed out.",
            };
            setError(errorMessages[err.code] || "An unknown error occurred.");
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };

    fetchLocationAndICUs();
  }, []);

  const handleSpecializationSubmit = (e) => {
    e.preventDefault();
    setIsPopupVisible(false);
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
          {loading ? (
            <p>Loading ICUs...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <>
              <div className={styles.icus}>
                <Icus
                  userId={userId}
                  specialization={specialization}
                  icus={icus}
                />
              </div>
              <div className={styles.map}>
                <Map icus={icus} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default UserHomeScreen;
