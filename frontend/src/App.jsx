import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VehicleDetails from "./pages/VehicleDetails";
import Reminders from "./pages/Reminders";  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;