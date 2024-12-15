import React, { useState } from "react";
import ICUMgmt from "./ICUMgmt";
import EmployeeManagement from "./EmployeeMgmt";
import VacationRequests from "./VacationRequests";
import "./ManagerDashboard.module.css";
import { useParams } from "react-router-dom";
// import EmployeeManagement from "./EmployeeMgmt";

function ManagerDashboard() {
  const { id: managerId } = useParams();
  const [activeTab, setActiveTab] = useState("icu");

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <nav className="tabs">
          <button
            className={activeTab === "icu" ? "active" : ""}
            onClick={() => setActiveTab("icu")}
          >
            ICU Management
          </button>
          <button
            className={activeTab === "employees" ? "active" : ""}
            onClick={() => setActiveTab("employees")}
          >
            Employee Management
          </button>
          <button
            className={activeTab === "vacations" ? "active" : ""}
            onClick={() => setActiveTab("vacations")}
          >
            Vacation Requests
          </button>
        </nav>
      </header>
      <main className="dashboard-content">
        {activeTab === "icu" && <ICUMgmt />}
        {activeTab === "employees" && managerId && (
          <EmployeeManagement managerId={managerId} />
        )}
        {activeTab === "vacations" && <VacationRequests />}
      </main>
    </div>
  );
}

export default ManagerDashboard;
