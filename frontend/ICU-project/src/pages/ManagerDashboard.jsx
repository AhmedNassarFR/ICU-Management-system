import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const { id: managerId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  // Fetch assigned employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3030/manager/view-all-employees/${managerId}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch employees data.");
        }

        setEmployees(response.data.employees);
      } catch (error) {
        setError("Unable to fetch employees. Please try again later.");
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
      key={employee._id}
      className={`employee-card ${
        selectedEmployee?._id === employee._id ? "selected" : ""
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
          {["overview", "tasks", "vacation"].map((tab) => (
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
                    <strong>Role:</strong> {selectedEmployee.role}
                  </p>
                  <p>
                    <strong>Department:</strong> {selectedEmployee.department}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="tasks-tab">
              <h3>Employee Tasks</h3>
              <button
                className="create-task-btn"
                onClick={() => setIsTaskModalOpen(true)}
              >
                Create New Task
              </button>
              {/* Tasks list would be populated here */}
            </div>
          )}

          {activeTab === "vacation" && (
            <div className="vacation-tab">
              <h3>Vacation Requests</h3>
              <button
                className="manage-vacation-btn"
                onClick={() => handleVacationRequests()}
              >
                Manage Vacation Requests
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Task creation handler
  const submitTask = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3030/manager/create-task`,
        {
          ...newTask,
          employeeId: selectedEmployee._id,
        }
      );

      if (response.status === 200) {
        alert("Task created successfully!");
        setIsTaskModalOpen(false);
        setNewTask({ title: "", description: "", deadline: "" });
      } else {
        throw new Error("Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("There was an issue creating the task. Please try again.");
    }
  };

  // Vacation request handler
  const handleVacationRequests = async () => {
    try {
      // Implement vacation request management logic
      // This could open a modal to view and approve/reject requests
      // Example API call:
      // const response = await axios.get(`http://localhost:3030/manager/vacation-requests/${selectedEmployee._id}`);
    } catch (error) {
      console.error("Error managing vacation requests:", error);
    }
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
            <span className="notification-badge">2</span>
          </button>
          <div className="profile-section">
            <span className="profile-name">Manager Dashboard</span>
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

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="task-modal">
          <div className="modal-content">
            <h3>Create New Task</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitTask();
              }}
            >
              <div className="form-group">
                <label htmlFor="taskTitle">Title</label>
                <input
                  id="taskTitle"
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDescription">Description</label>
                <textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDeadline">Deadline</label>
                <input
                  id="taskDeadline"
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) =>
                    setNewTask({ ...newTask, deadline: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Create Task
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsTaskModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
