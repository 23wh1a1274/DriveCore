import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VehicleDetails from "./pages/VehicleDetails";
import ViewVehicle from "./pages/ViewVehicle";
import EditVehicle from "./pages/EditVehicle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/login" />} />

        <Route path="/vehicles/:id" element={<VehicleDetails />}/>
        <Route path="/vehicle/:id" element={<ViewVehicle />} />
        <Route path="/vehicle/edit/:id" element={<EditVehicle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;