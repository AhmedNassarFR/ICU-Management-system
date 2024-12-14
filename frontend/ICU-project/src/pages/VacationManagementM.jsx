import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Manageer.module.css";

const VacationManagement = () => {
  const [vacationRequests, setVacationRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
  });

  const fetchVacationRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/manager/handle-vacation-request"
      );
      setVacationRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching vacation requests:", error);
    }
  };

  const handleCreateVacationRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/vacation-request", newRequest);
      fetchVacationRequests();
      setNewRequest({ employeeId: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error creating vacation request:", error);
    }
  };

  const handleUpdateVacationRequest = async (requestId, status) => {
    try {
      await axios.patch(
        `http://localhost:3030/manager/update-vacation-request/:requestId`,
        { status }
      );
      fetchVacationRequests();
    } catch (error) {
      console.error("Error updating vacation request:", error);
    }
  };

  useEffect(() => {
    fetchVacationRequests();
  }, []);

  return (
    <div className="dashboard-card">
      <h2>Vacation Management</h2>
      <form onSubmit={handleCreateVacationRequest} className="form-container">
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            value={newRequest.employeeId}
            onChange={(e) =>
              setNewRequest({ ...newRequest, employeeId: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={newRequest.startDate}
            onChange={(e) =>
              setNewRequest({ ...newRequest, startDate: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={newRequest.endDate}
            onChange={(e) =>
              setNewRequest({ ...newRequest, endDate: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn">
          Create Vacation Request
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vacationRequests.map((request) => (
            <tr key={request._id}>
              <td>
                {request.employee.firstName} {request.employee.lastName}
              </td>
              <td>{new Date(request.startDate).toLocaleDateString()}</td>
              <td>{new Date(request.endDate).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td>
                <button
                  className="btn"
                  onClick={() =>
                    handleUpdateVacationRequest(request._id, "Approved")
                  }
                >
                  Approve
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    handleUpdateVacationRequest(request._id, "Rejected")
                  }
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VacationManagement;
