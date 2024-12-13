import React, { useState } from "react";
import "./Manager.css";

const STATIC_EMPLOYEES = [
  {
    id: 1,
    firstName: "Michael",
    lastName: "Johnson",
    age: 35,
    department: "Sales",
    position: "Senior Sales Manager",
    hireDate: "2020-03-15",
    performanceStatus: {
      lastReview: "Excellent",
      currentProjectProgress: "85%",
      salesTarget: "110% achieved",
    },
    contactInfo: {
      email: "michael.johnson@company.com",
      phone: "+1 (555) 123-4567",
      workLocation: "Main Office",
    },
    performanceHistory: [
      "Q1 2023: Top Performer Award",
      "Consistently exceeded sales targets",
      "Led team expansion project",
    ],
    currentAssignments: [
      "Q2 Market Expansion Strategy",
      "Client Relationship Management",
      "Team Training Program",
    ],
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Rodriguez",
    age: 29,
    department: "Marketing",
    position: "Digital Marketing Specialist",
    hireDate: "2021-07-01",
    performanceStatus: {
      lastReview: "Very Good",
      currentProjectProgress: "75%",
      socialMediaReach: "150k followers",
    },
    contactInfo: {
      email: "emily.rodriguez@company.com",
      phone: "+1 (555) 987-6543",
      workLocation: "Remote",
    },
    performanceHistory: [
      "Social Media Campaign Success",
      "Brand Engagement Improvement",
      "Content Strategy Innovation",
    ],
    currentAssignments: [
      "Summer Marketing Campaign",
      "Brand Positioning Research",
      "Influencer Partnership Development",
    ],
  },
];

const ManagerDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = STATIC_EMPLOYEES.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const renderEmployeeCard = (employee) => (
    <div
      key={employee.id}
      className={`employee-card ${
        selectedEmployee?.id === employee.id ? "selected" : ""
      }`}
      onClick={() => setSelectedEmployee(employee)}
    >
      <div className="employee-card-header">
        <div>
          <h3>
            {employee.firstName} {employee.lastName}
          </h3>
          <span className="employee-department">{employee.department}</span>
        </div>
        <span className="employee-position">{employee.position}</span>
      </div>
      <div className="employee-card-footer">
        <span>Hired: {employee.hireDate}</span>
      </div>
    </div>
  );

  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;

    return (
      <div className="employee-details">
        <div className="employee-details-header">
          <div className="employee-header-info">
            <h2>
              {selectedEmployee.firstName} {selectedEmployee.lastName}
            </h2>
            <span className="employee-header-position">
              {selectedEmployee.position}
            </span>
          </div>
          <div className="header-actions">
            <button className="action-btn edit-btn">Edit Profile</button>
            <button className="action-btn performance-btn">
              Review Performance
            </button>
            <button
              className="close-btn"
              onClick={() => setSelectedEmployee(null)}
            >
              ×
            </button>
          </div>
        </div>

        <div className="employee-details-tabs">
          {["overview", "performance", "contact", "assignments"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="employee-details-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="overview-grid">
                <div className="overview-item">
                  <h4>Personal Information</h4>
                  <p>
                    <strong>Age:</strong> {selectedEmployee.age}
                  </p>
                  <p>
                    <strong>Department:</strong> {selectedEmployee.department}
                  </p>
                  <p>
                    <strong>Hire Date:</strong> {selectedEmployee.hireDate}
                  </p>
                </div>
                <div className="overview-item">
                  <h4>Current Position</h4>
                  <p>{selectedEmployee.position}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="performance-tab">
              <div className="performance-stats">
                {Object.entries(selectedEmployee.performanceStatus).map(
                  ([key, value]) => (
                    <div key={key} className="performance-stat">
                      <span>{key.replace(/([A-Z])/g, " $1")}</span>
                      <strong>{value}</strong>
                    </div>
                  )
                )}
              </div>
              <div className="performance-history">
                <h3>Performance History</h3>
                <ul>
                  {selectedEmployee.performanceHistory.map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="contact-tab">
              <h3>Contact Information</h3>
              {Object.entries(selectedEmployee.contactInfo).map(
                ([key, value]) => (
                  <p key={key}>
                    <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}
                  </p>
                )
              )}
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="assignments-tab">
              <h3>Current Assignments</h3>
              <ul>
                {selectedEmployee.currentAssignments.map(
                  (assignment, index) => (
                    <li key={index}>{assignment}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Employee Management</h1>
        <div className="header-actions">
          <div className="search-wrapper">
            <i className="search-icon">🔍</i>
            <input
              type="search"
              placeholder="Search employees..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="notification-btn">
            <span className="notification-badge">3</span>
          </button>
          <div className="profile-section">
            <span className="profile-name">Sarah Williams</span>
            <span className="profile-role">HR Manager</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="employees-list">
          <div className="employees-list-header">
            <h2>Team Overview</h2>
            <span className="employee-count">
              {filteredEmployees.length} Total Employees
            </span>
            <button className="add-employee-btn">+ Add Employee</button>
          </div>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(renderEmployeeCard)
          ) : (
            <div className="no-employees">No employees found</div>
          )}
        </div>

        <div className="employee-details-section">
          {selectedEmployee ? (
            renderEmployeeDetails()
          ) : (
            <div className="no-employee-selected">
              <h3>Select an Employee</h3>
              <p>Click on an employee card to view detailed information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
