import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
