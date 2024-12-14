import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeMgmt.css";

function EmployeeMgmt({managerId}) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3030/manager/view-all-employees/${managerId}`);
        setEmployees(response.data.employees || []);
      } catch (err) {
        setError("Unable to fetch employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="employee-mgmt">
      <h2>Employee Management</h2>
      <ul className="employee-list">
        {employees.map((employee) => (
          <li key={employee._id} className="employee-item">
            <h3>{employee.firstName} {employee.lastName}</h3>
            <p>Role: {employee.role}</p>
            <p>Department: {employee.department}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeMgmt;