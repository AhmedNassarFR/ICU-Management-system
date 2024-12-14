import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Manageer.module.css";

const ICUManagement = () => {
  const [icus, setICUs] = useState([]);
  const [newICU, setNewICU] = useState({
    hospitalId: "",
    specialization: "",
    status: "",
  });

  const fetchICUs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/manager/view-icus"
      );
      setICUs(response.data.data);
    } catch (error) {
      console.error("Error fetching ICUs:", error);
    }
  };

  const handleAddICU = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3030/manager/register-icu", newICU);
      fetchICUs();
      setNewICU({ hospitalId: "", specialization: "", status: "" });
    } catch (error) {
      console.error("Error adding ICU:", error);
    }
  };

  useEffect(() => {
    fetchICUs();
  }, []);

  return (
    <div className="dashboard-card">
      <h2>ICU Management</h2>
      <form onSubmit={handleAddICU} className="form-container">
        <div className="form-group">
          <label>Hospital ID</label>
          <input
            type="text"
            value={newICU.hospitalId}
            onChange={(e) =>
              setNewICU({ ...newICU, hospitalId: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            value={newICU.specialization}
            onChange={(e) =>
              setNewICU({ ...newICU, specialization: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            value={newICU.status}
            onChange={(e) => setNewICU({ ...newICU, status: e.target.value })}
            required
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>
        <button type="submit" className="btn">
          Add ICU
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Hospital</th>
            <th>Specialization</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {icus.map((icu) => (
            <tr key={icu._id}>
              <td>{icu.hospital.name}</td>
              <td>{icu.specialization}</td>
              <td>{icu.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ICUManagement;
