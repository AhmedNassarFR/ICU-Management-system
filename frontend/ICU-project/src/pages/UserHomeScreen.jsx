import Map from "../components/Map.jsx";
import Icus from "../components/Icus.jsx";
import "./UserHomeScreen.css";

function UserHomeScreen() {
  return (
    <div className="user-home-container">
      <Icus />
      <Map />
    </div>
  );
}

export default UserHomeScreen;
