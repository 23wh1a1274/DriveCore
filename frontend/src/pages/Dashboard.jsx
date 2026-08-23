import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const API_URL = "http://localhost:5000/api";

  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Vehicle form
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Search filters
  const [searchMake, setSearchMake] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const isAdmin = user?.role === "ADMIN";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch all dealership vehicles
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/vehicles`,
        { headers }
      );

      setVehicles(response.data.vehicles || []);
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

  // Search vehicles
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();

      if (searchMake) params.append("make", searchMake);
      if (searchModel) params.append("model", searchModel);
      if (searchCategory) params.append("category", searchCategory);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const response = await axios.get(
        `${API_URL}/vehicles/search?${params.toString()}`,
        { headers }
      );

      setVehicles(response.data.vehicles || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to search vehicles"
      );
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchMake("");
    setSearchModel("");
    setSearchCategory("");
    setMinPrice("");
    setMaxPrice("");

    fetchVehicles();
  };

  // Add or update vehicle
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();

    const vehicleData = {
      make,
      model,
      category,
      price: Number(price),
      quantity: Number(quantity),
    };

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/vehicles/${editingId}`,
          vehicleData,
          { headers }
        );

        alert("Vehicle updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/vehicles`,
          vehicleData,
          { headers }
        );

        alert("Vehicle added successfully!");
      }

      resetForm();
      fetchVehicles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save vehicle"
      );
    }
  };

  const resetForm = () => {
    setMake("");
    setModel("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setEditingId(null);
  };

  // Edit vehicle
  const handleEdit = (vehicle) => {
    setMake(vehicle.make);
    setModel(vehicle.model);
    setCategory(vehicle.category);
    setPrice(vehicle.price);
    setQuantity(vehicle.quantity);

    setEditingId(vehicle.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Purchase vehicle
  const handlePurchase = async (id) => {
    try {
      await axios.post(
        `${API_URL}/vehicles/${id}/purchase`,
        {},
        { headers }
      );

      alert("Vehicle purchased successfully!");

      fetchVehicles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to purchase vehicle"
      );
    }
  };

  // Restock vehicle
  const handleRestock = async (id) => {
    const amount = window.prompt(
      "Enter quantity to add:"
    );

    if (!amount || Number(amount) <= 0) {
      return;
    }

    try {
      await axios.post(
        `${API_URL}/vehicles/${id}/restock`,
        {
          quantity: Number(amount),
        },
        { headers }
      );

      alert("Vehicle restocked successfully!");

      fetchVehicles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to restock vehicle"
      );
    }
  };

  // Delete vehicle
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/vehicles/${id}`,
        { headers }
      );

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
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            DriveCore 🚗
          </h1>

          <p className="text-gray-600 mt-1">
            Welcome, {user?.name || "User"}!
            {isAdmin && " 👑 Admin"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* Admin Add / Edit Form */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-bold mb-5">
              {editingId
                ? "Edit Vehicle"
                : "Add Vehicle"}
            </h2>

            <form
              onSubmit={handleVehicleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Make (Toyota, Honda...)"
                value={make}
                onChange={(e) =>
                  setMake(e.target.value)
                }
                required
                className="border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Model"
                value={model}
                onChange={(e) =>
                  setModel(e.target.value)
                }
                required
                className="border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Category (SUV, Sedan...)"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                required
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                required
                min="0"
                className="border p-3 rounded-lg"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg"
                >
                  {editingId
                    ? "Update Vehicle"
                    : "Add Vehicle"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-400 text-white px-5 py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Search Vehicles 🔍
          </h2>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Search by Make"
              value={searchMake}
              onChange={(e) =>
                setSearchMake(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Search by Model"
              value={searchModel}
              onChange={(e) =>
                setSearchModel(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Category"
              value={searchCategory}
              onChange={(e) =>
                setSearchCategory(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Minimum Price"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Maximum Price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-3 rounded-lg"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-gray-500 text-white px-5 py-3 rounded-lg"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Inventory */}
        <h2 className="text-2xl font-bold mb-5">
          Dealership Inventory
        </h2>

        {vehicles.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            No vehicles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow p-6"
              >
                <h3 className="text-xl font-bold">
                  {vehicle.make} {vehicle.model}
                </h3>

                <p className="text-gray-600 mt-2">
                  Category: {vehicle.category}
                </p>

                <p className="text-gray-600">
                  Price: ₹{vehicle.price}
                </p>

                <p className="text-gray-600 mb-4">
                  Available: {vehicle.quantity}
                </p>

                <div className="flex flex-wrap gap-2">

                  {/* Purchase */}
                  <button
                    onClick={() =>
                      handlePurchase(vehicle.id)
                    }
                    disabled={vehicle.quantity === 0}
                    className={`px-4 py-2 rounded-lg text-white ${
                      vehicle.quantity === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600"
                    }`}
                  >
                    {vehicle.quantity === 0
                      ? "Out of Stock"
                      : "Purchase"}
                  </button>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() =>
                          handleEdit(vehicle)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleRestock(vehicle.id)
                        }
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                      >
                        Restock
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(vehicle.id)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;