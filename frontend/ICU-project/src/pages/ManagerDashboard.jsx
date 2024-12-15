import DashboardCard from "../components/DashBoardCard";
import styles from "./ManagerDashboard.module.css";

function ManagerDashboard() {
  const { id: managerId } = useParams();
  const [activeTab, setActiveTab] = useState("icu");

  return (
    <>
      <div>
        <h1 style={{ fontSize: 30 }}>
          Welcome MR. Manager, what do you want to do today!
        </h1>
      </div>
      <div className={styles.adminPageContainer}>
        <DashboardCard
          title={"Manage ICUs"}
          icon={"🏨"}
          color={styles.colorLightgreen}
          route="/Addhospital"
        />
        <DashboardCard
          title={"Manage Employees"}
          icon={"👨‍⚕️"}
          color={styles.colorLightred}
          route="/ViewHospital"
        />
        <DashboardCard
          title={"Vecation Requests"}
          icon={"🌴"}
          color={styles.colorLightpurple}
          route="/"
        />
      </div>
    </>
  );
}

export default ManagerDashboard;
