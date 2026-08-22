import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [editingId, setEditingId] = useState(null);  
  const [vehicles, setVehicles] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const API_URL = "http://localhost:5000/api";

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchVehicles();
  }, []);

  // Add vehicle
const handleVehicleSubmit = async (e) => {
  e.preventDefault();

  try {
    const vehicleData = {
      brand,
      model,
      year: Number(year),
      mileage: Number(mileage),
      fuelType,
    };

    if (editingId) {
      await axios.put(
        `${API_URL}/vehicles/${editingId}`,
        vehicleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vehicle updated successfully!");
    } else {
      await axios.post(
        `${API_URL}/vehicles`,
        vehicleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vehicle added successfully!");
    }

    setBrand("");
    setModel("");
    setYear("");
    setMileage("");
    setFuelType("");
    setEditingId(null);

    fetchVehicles();
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Failed to save vehicle"
    );
  }
};

 const handleEdit = (vehicle) => {
  setBrand(vehicle.brand);
  setModel(vehicle.model);
  setYear(vehicle.year);
  setMileage(vehicle.mileage);
  setFuelType(vehicle.fuelType);

  setEditingId(vehicle.id);
};

  // Delete vehicle
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Vehicle deleted successfully!");

      fetchVehicles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete vehicle"
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div>
      <h1>DriveCore 🚗</h1>

      <h2>
        Welcome, {user?.name || "User"}!
      </h2>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h2>Add Vehicle</h2>

      <form onSubmit={handleVehicleSubmit}>
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="Mileage"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          required
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <br /><br />

        <button type="submit">
            {editingId ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </form>

      <hr />

      <h2>My Vehicles</h2>

      {vehicles.length === 0 ? (
        <p>No vehicles added yet.</p>
      ) : (
        vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            style={{
              border: "1px solid black",
              padding: "15px",
              margin: "10px",
            }}
          >
            <h3>
              {vehicle.brand} {vehicle.model}
            </h3>

            <p>Year: {vehicle.year}</p>
            <p>Mileage: {vehicle.mileage} km</p>
            <p>Fuel Type: {vehicle.fuelType}</p>

            <button
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                >
                View Details
                </button>

                {" "}

            <button
                onClick={() => handleEdit(vehicle)}
            >
                Edit
            </button>

            {" "}

            <button
              onClick={() => handleDelete(vehicle.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;