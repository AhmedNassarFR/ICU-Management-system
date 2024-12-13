import DashboardCard from "../components/DashBoardCard";
import "./AdminPage.css";

function AdminPage() {
  return (
    <>
      <div>
        <h1 style={{ fontSize: 30 }}>
          Welcome MR.Admin what do you want to do today!
        </h1>
      </div>
      <div className="admin-page-container">
        <DashboardCard
          title={"Add Hospitals"}
          icon={"🏥"}
          color={"#a8e6cf"}
          route="/Addhospital"
        />
        <DashboardCard
          title={"View Hospitals"}
          icon={"🚑"}
          color={"#ff8b94"}
          route="/"
        />
        <DashboardCard
          title={"View All Admins"}
          icon={"👩‍💼"}
          color={"#d4a5ff"}
          route="/"
        />
        <DashboardCard
          title={"View All Managers"}
          icon={"🛠️"}
          color={"#fdfd96 "}
          route="/"
        />
        <DashboardCard
          title={"Search Managers By Hospitals"}
          icon={"🔍"}
          color={"#ffd3b6"}
          route="/"
        />
      </div>
    </>
  );
}

export default AdminPage;
