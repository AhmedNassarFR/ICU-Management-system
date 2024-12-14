import Map from "../components/Map.jsx";
import Icus from "../components/Icus.jsx";
import "./UserHomeScreen.css";
import { useParams } from "react-router-dom";

function UserHomeScreen() {
  const { id: doctorId } = useParams();
  return (
    <div className="user-home-container">
      <div className="icus">
        <Icus userId={doctorId} />
      </div>
      <div className="map">
        <Map />
      </div>
    </div>
  );
}

export default UserHomeScreen;
