import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegisterForm";
import AdminPage from "./pages/AdminPage";
import io from "socket.io-client";
import PrivateRoute from "./pages/PrivateRoute";
import Doctor from "./pages/Doctor";
 import Manager from "./pages/Manager";
import UserHomeScreen from "./pages/UserHomeScreen";
import AddHospital from "./pages/adminPages/AddHospital";
//import ManagerDashboard from "./pages/ManagerDashboard";
import ViewAllHospital from "./pages/adminPages/ViewAllHospital";
import ManagerDashboard from "./pages/Manager";

// Use the correct server URL for the socket connection
const socket = io("http://localhost:3030", {
  transports: ["websocket"], // Use WebSocket transport explicitly
  autoConnect: true, // Automatically connect
});

function App() {
  useEffect(() => {
    // Listen for "Data" event when the component mounts
    socket.on("Data", (data) => {
      console.log("Data received from server:", data);
    });

    // Cleanup to avoid memory leaks
    return () => {
      socket.off("Data");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Login" element={<LoginForm />} />
        <Route path="/Register" element={<RegistrationForm />} />
        <Route path="/Admin" element={<AdminPage />} />
        {/* <Route path="/Home" element={<UserHomeScreen />} /> */}
        <Route path="/Addhospital" element={<AddHospital />} />
        <Route path="/ViewHospital" element={<ViewAllHospital />} />

        <Route
          path="/Home/:id"
          element={
            <PrivateRoute requiredRole="Patient">
              <UserHomeScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/Doctor/:id"
          element={
            <PrivateRoute requiredRole="Doctor">
              <Doctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/Manager/:id"
          element={
            <PrivateRoute requiredRole="Manager">
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/Addhospital"
          element={
            <PrivateRoute requiredRole="Admin">
              <AddHospital />
            </PrivateRoute>
          }
        /> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
