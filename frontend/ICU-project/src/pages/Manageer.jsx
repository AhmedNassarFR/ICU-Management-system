import React, { useState } from "react";
import ICUManagement from "./ICUManagementM.jsx";
import EmployeeManagement from "./EmployeeManagementM.jsx";
import VacationManagement from "./VacationManagementM.jsx";
import "./Manageer.module.css";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("icu");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "icu":
        return <ICUManagement />;
      case "employees":
        return <EmployeeManagement />;
      case "vacations":
        return <VacationManagement />;
      default:
        return <ICUManagement />;
    }
  };

  return (
    <div className="manager-dashboard">
      <div className="dashboard-tabs">
        <div
          className={`dashboard-tab ${activeTab === "icu" ? "active" : ""}`}
          onClick={() => setActiveTab("icu")}
        >
          ICU Management
        </div>
        <div
          className={`dashboard-tab ${
            activeTab === "employees" ? "active" : ""
          }`}
          onClick={() => setActiveTab("employees")}
        >
          Employee Management
        </div>
        <div
          className={`dashboard-tab ${
            activeTab === "vacations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("vacations")}
        >
          Vacation Management
        </div>
      </div>
      {renderActiveComponent()}
    </div>
  );
};

export default ManagerDashboard;
