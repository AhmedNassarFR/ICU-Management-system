import { useState } from "react";
import "./Doctor.css";

const STATIC_PATIENTS = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    age: 45,
    gender: "Male",
    currentCondition: "Recovering from Surgery",
    admissionDate: "2024-01-15",
    healthStatus: {
      temperature: "98.6°F",
      bloodPressure: "120/80",
      heartRate: "72 bpm",
    },
    medicalHistory: [
      "Appendectomy in 2020",
      "Hypertension management",
      "Annual checkup in 2023",
    ],
    medicineSchedule:
      "Morning: Antibiotics\nAfternoon: Pain Management\nEvening: Recovery Supplements",
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Smith",
    age: 35,
    gender: "Female",
    currentCondition: "Post-Pregnancy Care",
    admissionDate: "2024-02-01",
    healthStatus: {
      temperature: "98.4°F",
      bloodPressure: "115/75",
      heartRate: "68 bpm",
    },
    medicalHistory: [
      "Normal delivery",
      "No prior major health issues",
      "Routine prenatal care",
    ],
    medicineSchedule:
      "Morning: Prenatal Vitamins\nAfternoon: Calcium Supplements\nEvening: Iron Tablets",
  },
];

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [Paintnet, setPaintnet] = useState("");

  const filteredPatients = STATIC_PATIENTS.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const renderPatientCard = (patient) => (
    <div
      key={patient.id}
      className={`patient-card ${
        selectedPatient?.id === patient.id ? "selected" : ""
      }`}
      onClick={() => setSelectedPatient(patient)}
    >
      <div className="patient-card-header">
        <div>
          <h3>
            {patient.firstName} {patient.lastName}
          </h3>
          <span className="patient-condition">{patient.currentCondition}</span>
        </div>
        <span className="patient-age">{patient.age} years</span>
      </div>
      <div className="patient-card-footer">
        <span>Admitted: {patient.admissionDate}</span>
      </div>
    </div>
  );

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
          {["overview", "health", "history", "medicine"].map((tab) => (
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
                    <strong>Age:</strong> {selectedPatient.age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedPatient.gender}
                  </p>
                  <p>
                    <strong>Admission Date:</strong>{" "}
                    {selectedPatient.admissionDate}
                  </p>
                </div>
                <div className="overview-item">
                  <h4>Current Condition</h4>
                  <p>{selectedPatient.currentCondition}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="health-tab">
              <div className="health-stats">
                {Object.entries(selectedPatient.healthStatus).map(
                  ([key, value]) => (
                    <div key={key} className="health-stat">
                      <span>{key.replace(/([A-Z])/g, " $1")}</span>
                      <strong>{value}</strong>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="history-tab">
              <h3>Medical History</h3>
              <ul>
                {selectedPatient.medicalHistory.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "medicine" && (
            <div className="medicine-tab">
              <h3>Medicine Schedule</h3>
              <pre>{selectedPatient.medicineSchedule}</pre>
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
            {/* <div className="profile-icon">DR</div> */}
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
          {filteredPatients.length > 0 ? (
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
