import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ManagerDashboard.module.css";

const ManagerDashboard = () => {
  const { id: managerId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        // Fetch assigned employees for the manager
        const response = await axios.get(
          `http://localhost:3030/manager/assigned-employees/${managerId}/`
        );

        // Check if the response status is ok
        if (response.status !== 200) {
          throw new Error("Failed to fetch employees data.");
        }

        console.log(response.data.message);
        // Set the employees data from the response
        setEmployees(response.data.employees);
      } catch (error) {
        setError("Unable to fetch employees. Please try again later.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [managerId]);

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Render employee card
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
          <span className="employee-role">{employee.role}</span>
        </div>
      </div>
      <div className="employee-card-footer">
        <span>Department: {employee.department}</span>
      </div>
    </div>
  );

  // Render employee details
  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;

    return (
      <div className="employee-details">
        <div className="employee-details-header">
          <div className="employee-header-info">
            <h2>
              {selectedEmployee.firstName} {selectedEmployee.lastName}
            </h2>
            <span className="employee-header-role">
              {selectedEmployee.role}
            </span>
          </div>
          <button
            className="close-btn"
            onClick={() => setSelectedEmployee(null)}
          >
            ×
          </button>
        </div>

        <div className="employee-details-tabs">
          {["overview", "tasks", "vacations"].map((tab) => (
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
                    <strong>Email:</strong> {selectedEmployee.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedEmployee.phone}
                  </p>
                </div>
                <div className="overview-item">
                  <h4>Work Details</h4>
                  <p>
                    <strong>Department:</strong> {selectedEmployee.department}
                  </p>
                  <p>
                    <strong>Role:</strong> {selectedEmployee.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="tasks-tab">
              <h3>Assigned Tasks</h3>
              <ul>
                {selectedEmployee.tasks && selectedEmployee.tasks.length > 0 ? (
                  selectedEmployee.tasks.map((task) => (
                    <li key={task.id}>
                      {task.name} - {task.status}
                    </li>
                  ))
                ) : (
                  <p>No tasks assigned</p>
                )}
              </ul>
            </div>
          )}

          {activeTab === "vacations" && (
            <div className="vacations-tab">
              <h3>Vacation Requests</h3>
              <ul>
                {selectedEmployee.vacationRequests &&
                selectedEmployee.vacationRequests.length > 0 ? (
                  selectedEmployee.vacationRequests.map((request) => (
                    <li key={request.id}>
                      {request.startDate} - {request.endDate}
                      (Status: {request.status})
                    </li>
                  ))
                ) : (
                  <p>No vacation requests</p>
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
        <h1>Manager Dashboard</h1>
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
            <span className="profile-name">Manager Name</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="employees-list">
          <div className="employees-list-header">
            <h2>My Employees</h2>
            <span className="employee-count">
              {filteredEmployees.length} Total
            </span>
          </div>

          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredEmployees.length > 0 ? (
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
