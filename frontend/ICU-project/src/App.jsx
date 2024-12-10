import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
<<<<<<< HEAD:frontend/ICU-project/src/App.jsx
import RegistrationForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
=======
import AdminPage from "./pages/AdminPage";
>>>>>>> 2cacbd2a087e9bc9687338f6de0d66d3b55d05fe:frontend/ICU project/src/App.jsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
<<<<<<< HEAD:frontend/ICU-project/src/App.jsx
        <Route path="/Login" element={<LoginForm />} />
        <Route path="/Register" element={<RegistrationForm />} />
=======
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin" element={<AdminPage />} />
>>>>>>> 2cacbd2a087e9bc9687338f6de0d66d3b55d05fe:frontend/ICU project/src/App.jsx
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
