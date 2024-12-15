import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import axios
import "./EmployeeMgmt.module.css";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const { id: managerId } = useParams(); // Manager ID from route params
  console.log("Manager ID from useParams:", managerId);

  useEffect(() => {
    // Ensure managerId is available before fetching
    if (managerId) {
      console.log("Fetching employees...");
      axios
        .get(`http://localhost:3030/manager/view-all-employees/${managerId}`)
        .then((response) => {
          console.log("Employees data:", response.data); // Log to check structure
          setEmployees(response.data.employees); // Access the employees array
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [managerId]);

  // Remove Employee by _id
  const handleRemoveEmployee = (_id) => {
    console.log("Removing employee with ID:", _id); // Log the _id before making the API call
    axios
      .delete(`http://localhost:3030/manager/remove-employee/${_id}`)
      .then(() => {
        // Remove the employee from the local state
        setEmployees(employees.filter((emp) => emp._id !== _id)); // Filter by _id
        setSelectedEmployee(null); // Clear the selected employee
        setModalAction(null); // Close any open modals
      })
      .catch((error) => {
        console.error("Error removing employee:", error);
        // Optional: Add error handling UI
      });
  };

  // Open Modal
  const openModal = (action) => {
    setModalAction(action);
  };

  // Close Modal
  const closeModal = () => {
    setModalAction(null);
  };

  // When an employee is selected
  const handleSelectEmployee = (employee) => {
    console.log("Employee clicked:", employee); // Check the employee object
    setSelectedEmployee(employee); // Store the selected employee
  };

  return (
    <div className="employee-management">
      <h1>Employee Management</h1>

      <div className="employee-grid">
        {employees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          employees.map((employee) => (
            <div
              key={employee._id} // Use _id as the key
              className={`employee-card ${
                selectedEmployee === employee ? "selected" : ""
              }`}
              onClick={() => handleSelectEmployee(employee)} // Pass selected employee
            >
              <div className="card-header">
                <h2>{`${employee.firstName} ${employee.lastName}`}</h2>
              </div>
              <div className="card-content">
                <p>Role: {employee.role}</p>
                <p>Email: {employee.email}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedEmployee && (
        <div className="employee-actions">
          <button
            className="btn btn-remove"
            onClick={() => handleRemoveEmployee(selectedEmployee._id)} // Use _id for deletion
          >
            Remove Employee
          </button>
          <button
            className="btn btn-assign"
            onClick={() => openModal("assign")}
          >
            Assign Task
          </button>
          <button className="btn btn-track" onClick={() => openModal("track")}>
            Track Tasks
          </button>
        </div>
      )}

      {/* Assign Task Modal */}
      {modalAction === "assign" && selectedEmployee && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Assign Task to {selectedEmployee.firstName}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <AssignTaskForm
              employeeId={selectedEmployee._id} // Pass _id to AssignTaskForm
              onClose={closeModal}
            />
          </div>
        </div>
      )}

      {/* Track Tasks Modal */}
      {modalAction === "track" && selectedEmployee && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tasks for {selectedEmployee.firstName}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <TrackTasks
              employeeId={selectedEmployee._id} // Pass _id to TrackTasks
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Assign Task Form Component
function AssignTaskForm({ employeeId, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    deadLine: "",
    priority: "",
    status: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3030/manager/create-and-assign-task",
        { ...formData, employeeId }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      onClose();
    } catch (error) {
      console.error("Error assigning task:", error);
      // Optional: Add error handling UI
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        name="name"
        placeholder="Task Name"
        onChange={handleChange}
        required
      />
      <input type="date" name="deadLine" onChange={handleChange} required />
      <input
        type="text"
        name="priority"
        placeholder="Priority"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="status"
        placeholder="Status"
        onChange={handleChange}
        required
      />
      <div className="form-actions">
        <button type="submit">Assign</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// Track Tasks Component
function TrackTasks({ employeeId, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3030/manager/track-tasks?employeeId=${employeeId}`)
      .then((response) => setTasks(response.data))
      .catch((error) => {
        console.error("Error tracking tasks:", error);
        setError("Failed to load tasks");
      });
  }, [employeeId]);

  if (error) {
    return (
      <div className="tasks-list">
        <p>{error}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div className="tasks-list">
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.name} - {task.status}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default EmployeeManagement;
