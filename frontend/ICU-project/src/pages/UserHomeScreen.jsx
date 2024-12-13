import Map from "../components/Map.jsx";
import Icus from "../components/Icus.jsx";
import "./UserHomeScreen.css";

function UserHomeScreen() {
  return (
    <div className="user-home-container">
      <div className="icus">
        <Icus />
      </div>
      <div className="map">
        <Map />
      </div>
    </div>
  );
}

export default UserHomeScreen;
