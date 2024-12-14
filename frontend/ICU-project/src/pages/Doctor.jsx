import { useState, useEffect } from "react";
import "./Doctor.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const DoctorDashboard = () => {
  const { id: doctorId } = useParams();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMedicineSchedule, setNewMedicineSchedule] = useState("");

  // Fetch patients data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3030/doctor/assigned-patients/doctor/${doctorId}/`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch patients data.");
        }

        setPatients(response.data.patients);
      } catch (error) {
        setError("Unable to fetch patients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [doctorId]);

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Handle medicine schedule update
  const handleUpdateMedicineSchedule = async () => {
    const patientId = selectedPatient?.id || selectedPatient?._id;

    if (!patientId || !newMedicineSchedule.trim()) {
      alert("Please select a patient and enter a valid medicine schedule.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3030/doctor/update-medicine-schedule/doctor/${doctorId}/patient/${patientId}`,
        { medicineSchedule: newMedicineSchedule }
      );

      if (response.status === 200) {
        setSelectedPatient((prev) => ({
          ...prev,
          medicineSchedule: newMedicineSchedule,
        }));
        setNewMedicineSchedule(""); // Clear input
        alert("Medicine schedule updated successfully.");
      } else {
        throw new Error("Failed to update medicine schedule.");
      }
    } catch (error) {
      console.error("Error updating medicine schedule:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Render patient card
  const renderPatientCard = (patient) => (
    <div
      key={patient.id || patient._id} // Handle cases where the field might be `_id`
      className={`patient-card ${
        selectedPatient?.id === patient.id ? "selected" : ""
      }`}
      onClick={() => {
        console.log("Selected patient:", patient); // Debug log
        setSelectedPatient(patient);
      }}
    >
      <div className="patient-card-header">
        <h3>
          {patient.firstName} {patient.lastName}
        </h3>
      </div>
    </div>
  );

  // Render patient details
  const renderPatientDetails = () => {
    if (!selectedPatient) return null;

    return (
      <div className="patient-details">
        <div className="patient-details-header">
          <div className="patient-header-info">
            <h2>
              {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <span className="patient-header-condition">
              {selectedPatient.currentCondition}
            </span>
          </div>
          <button
            className="close-btn"
            onClick={() => setSelectedPatient(null)}
          >
            ×
          </button>
        </div>

        <div className="patient-details-tabs">
          {["overview", "history", "medicine"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="patient-details-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="overview-grid">
                <div className="overview-item">
                  <h4>Personal Information</h4>
                  <p>
                    <strong>Gender:</strong> {selectedPatient.gender}
                  </p>
                  <p>
                    <strong>Admission Date:</strong> {selectedPatient.admissionDate}
                  </p>
                </div>
                <div className="overview-item">
                  <h4>Current Condition</h4>
                  <p>{selectedPatient.currentCondition}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="history-tab">
              <h3>Medical History</h3>
              <p>{selectedPatient.medicalHistory || "No medical history available."}</p>
            </div>
          )}

          {activeTab === "medicine" && (
            <div className="medicine-tab">
              <h3>Medicine Schedule</h3>
              <pre>{selectedPatient.medicineSchedule || "No schedule available."}</pre>
              <textarea
                className="medicine-input"
                placeholder="Update medicine schedule"
                value={newMedicineSchedule}
                onChange={(e) => setNewMedicineSchedule(e.target.value)}
              ></textarea>
              <button
                className="update-medicine-btn"
                onClick={handleUpdateMedicineSchedule}
              >
                Update Schedule
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <div className="header-actions">
          <div className="search-wrapper">
            <i className="search-icon">🔍</i>
            <input
              type="search"
              placeholder="Search patients..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="notification-btn">
            <span className="notification-badge">2</span>
          </button>
          <div className="profile-section">
            <span className="profile-name">Dr. Sarah Thompson</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="patients-list">
          <div className="patients-list-header">
            <h2>My Patients</h2>
            <span className="patient-count">
              {filteredPatients.length} Total
            </span>
          </div>

          {loading ? (
            <div className="loading">Loading patients...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map(renderPatientCard)
          ) : (
            <div className="no-patients">No patients found</div>
          )}
        </div>

        <div className="patient-details-section">
          {selectedPatient ? (
            renderPatientDetails()
          ) : (
            <div className="no-patient-selected">
              <h3>Select a Patient</h3>
              <p>Click on a patient card to view detailed information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
