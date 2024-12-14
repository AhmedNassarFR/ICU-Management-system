import Map from "../components/Map.jsx";
import Icus from "../components/Icus.jsx";
import styles from "./UserHomeScreen.module.css";
import { useParams } from "react-router-dom";

function UserHomeScreen() {
  const { id: doctorId } = useParams();
  return (
    <div className={styles.userHomeContainer}>
      <div className={styles.icus}>
        <Icus userId={doctorId} />
      </div>
      <div className={styles.map}>
        <Map />
      </div>
    </div>
  );
}

export default UserHomeScreen;
