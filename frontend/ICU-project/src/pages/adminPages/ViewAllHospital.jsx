import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../../socket"; // Ensure the correct path
import "./ViewAllHospital.css";

function ViewAllHospital() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3030/admin/view-hospitals"
        );
        setHospitals(response.data.hospitals || []);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError("Failed to load hospitals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();

    socket.on("hospitalAdded", (newHospital) => {
      console.log("New hospital added:", newHospital);
      setHospitals((prevHospitals) => [...prevHospitals, newHospital]);
    });

    return () => {
      socket.off("hospitalAdded");
    };
  }, []);

  const handleDelete = async (hospitalId) => {
    try {
      console.log(hospitalId);
      await axios.delete(
        `http://localhost:3030/admin/delete-hospital/${hospitalId}`
      );
      setHospitals(hospitals.filter((hospital) => hospital._id !== hospitalId));
      alert("Hospital deleted successfully!");
    } catch (err) {
      console.error("Error deleting hospital:", err);
      alert("Failed to delete hospital. Please try again.");
    }
  };

  const handleBlock = async (hospitalId) => {
    try {
      await axios.put(
        `http://localhost:3030/admin/block-hospital/${hospitalId}`
      );
      setHospitals(
        hospitals.map((hospital) =>
          hospital._id === hospitalId
            ? { ...hospital, status: "Blocked" }
            : hospital
        )
      );
      alert("Hospital blocked successfully!");
    } catch (err) {
      console.error("Error blocking hospital:", err);
      alert("Failed to block hospital. Please try again.");
    }
  };

  const handleUnblock = async (hospitalId) => {
    try {
      await axios.put(
        `http://localhost:3030/admin/unblock-hospital/${hospitalId}`
      );
      setHospitals(
        hospitals.map((hospital) =>
          hospital._id === hospitalId
            ? { ...hospital, status: "Active" }
            : hospital
        )
      );
      alert("Hospital Unblocked successfully!");
    } catch (err) {
      console.error("Error Unblocking hospital:", err);
      alert("Failed to Unblock hospital. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading hospitals...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="view-all-hospitals">
      <h1>All Hospitals</h1>
      {hospitals.length === 0 ? (
        <p>No hospitals available at the moment.</p>
      ) : (
        <div className="hospital-list">
          {hospitals.map((hospital) => (
            <div
              key={hospital._id}
              className={`hospital-card ${
                hospital.status === "Active" ? "" : "hospital-card-blocked"
              }`}
            >
              <h2>{hospital.name}</h2>
              <p>
                <strong>Address:</strong> {hospital.address}
              </p>
              <p>
                <strong>Email:</strong> {hospital.email}
              </p>
              <p>
                <strong>Contact:</strong> {hospital.contactNumber}
              </p>
              <p>
                <strong>Status:</strong> {hospital.status}
              </p>
              <div className="hospital-actions">
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(hospital._id)}
                >
                  🗑️ Delete
                </button>
                {hospital.status === "Active" ? (
                  <button
                    className="action-button block-button"
                    onClick={() => handleBlock(hospital._id)}
                  >
                    ⛔️ Block
                  </button>
                ) : (
                  <button
                    className="action-button unblock-button"
                    onClick={() => handleUnblock(hospital._id)}
                  >
                    ✅ Unblock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewAllHospital;
