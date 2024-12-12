import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import RegistrationForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import AdminPage from "./pages/AdminPage";
import ICUSelect from "./pages/ICUSelect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Login" element={<LoginForm />} />
        <Route path="/Register" element={<RegistrationForm />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/icu" element={<ICUSelect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
