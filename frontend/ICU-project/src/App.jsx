import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegisterForm";
import AdminPage from "./pages/AdminPage";
import ICUSelect from "./pages/ICUSelect";
import io from "socket.io-client";
import PrivateRoute from "./pages/PrivateRoute";
import Doctor from "./pages/Doctor";
import Manager from "./pages/Manager";
import UserHomeScreen from "./pages/UserHomeScreen";

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
        <Route path="/Home" element={<UserHomeScreen />} />

        <Route
          path="/icu"
          element={
            <PrivateRoute requiredRole="Patient">
              <ICUSelect />
            </PrivateRoute>
          }
        />
        <Route
          path="/Doctor"
          element={
            <PrivateRoute requiredRole="Doctor">
              <Doctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/Manager"
          element={
            <PrivateRoute requiredRole="Manager">
              <Manager />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
