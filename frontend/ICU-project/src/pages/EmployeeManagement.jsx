import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagerDashboard.css";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    role: "",
    gender: "",
    userPass: "",
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/manager/view-all-employees/:managerId"
      );
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3030/manager/add-employee",
        newEmployee
      );
      fetchEmployees();
      setNewEmployee({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        phone: "",
        role: "",
        gender: "",
        userPass: "",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="dashboard-card">
      <h2>Employee Management</h2>
      <form onSubmit={handleAddEmployee} className="form-container">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={newEmployee.firstName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, firstName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={newEmployee.lastName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, lastName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={newEmployee.userName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, userName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={newEmployee.phone}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, phone: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={newEmployee.role}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, role: e.target.value })
            }
            required
          >
            <option value="">Select Role</option>
            <option value="Nurse">Nurse</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            value={newEmployee.gender}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, gender: e.target.value })
            }
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={newEmployee.userPass}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, userPass: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn">
          Add Employee
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>
                {employee.firstName} {employee.lastName}
              </td>
              <td>{employee.userName}</td>
              <td>{employee.role}</td>
              <td>{employee.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
