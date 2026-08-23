import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState("");

  const [loading, setLoading] = useState(true);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const API_URL = "http://localhost:5000/api";

  // Fetch Vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchVehicles();
  }, []);

  // Reset Form
  const resetForm = () => {
    setBrand("");
    setModel("");
    setYear("");
    setMileage("");
    setFuelType("");
    setEditingId(null);
  };

  // Open Add Vehicle Modal
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // Add or Update Vehicle
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

        alert("Vehicle updated successfully");
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

        alert("Vehicle added successfully");
      }

      handleCloseModal();
      fetchVehicles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save vehicle"
      );
    }
  };

  // Edit Vehicle
  const handleEdit = (vehicle) => {
    setBrand(vehicle.brand || "");
    setModel(vehicle.model || "");
    setYear(vehicle.year || "");
    setMileage(vehicle.mileage || "");
    setFuelType(vehicle.fuelType || "");

    setEditingId(vehicle.id);
    setIsModalOpen(true);
  };

  // Delete Vehicle
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

      alert("Vehicle deleted successfully");

      fetchVehicles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete vehicle"
      );
    }
  };

  const handleAskAI = async (question = aiMessage) => {
  if (!question.trim() || aiLoading) return;

  const userMessage = question.trim();

  setAiMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: userMessage,
    },
  ]);

  setAiMessage("");
  setAiLoading(true);

  try {
    const response = await axios.post(
      `${API_URL}/ai/chat`,
      {
        message: userMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAiMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response.data.reply,
      },
    ]);
  } catch (error) {
    console.error("AI error:", error);

    setAiMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          error.response?.data?.message ||
          "Unable to process your request. Please try again.",
      },
    ]);
  } finally {
    setAiLoading(false);
  }
};

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Dashboard Statistics
  const totalVehicles = vehicles.length;

  const totalMileage = vehicles.reduce(
    (total, vehicle) =>
      total + Number(vehicle.mileage || 0),
    0
  );

  const petrolVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.fuelType?.toLowerCase() === "petrol"
  ).length;

  const otherFuelVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.fuelType?.toLowerCase() !== "petrol"
  ).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* MAIN LAYOUT */}
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-black/40 p-6 lg:flex">

          {/* BRAND */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Drive<span className="text-red-500">Core</span>
            </h1>

            <p className="mt-2 text-xs tracking-wide text-gray-500">
              DEALERSHIP MANAGEMENT
            </p>
          </div>

          {/* NAVIGATION */}
          <nav className="mt-14 space-y-2">

            <button
              className="flex w-full items-center rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-left text-sm font-medium text-white transition"
            >
              <span className="mr-3 h-2 w-2 rounded-full bg-red-500" />
              Dashboard
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("vehicles-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="mr-3 h-2 w-2 rounded-full bg-gray-600" />
              My Vehicles
            </button>

            <button
              onClick={() => navigate("/reminders")}
              className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="mr-3 h-2 w-2 rounded-full bg-gray-600" />
              Service Reminders
            </button>

          </nav>

          {/* USER / LOGOUT */}
          <div className="mt-auto">

            <div className="mb-6 border-t border-white/10 pt-6">

              <p className="text-sm font-medium text-white">
                {user?.name || "User"}
              </p>

              <p className="mt-1 truncate text-xs text-gray-500">
                {user?.email || ""}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              Logout
            </button>

          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">

          {/* MOBILE HEADER */}
          <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-5 py-5 lg:hidden">

            <h1 className="text-xl font-semibold">
              Drive<span className="text-red-500">Core</span>
            </h1>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300"
            >
              Logout
            </button>

          </header>

          <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12 lg:py-10">

            {/* HEADER */}
            <section className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <p className="text-sm font-medium text-red-400">
                  DASHBOARD
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Welcome back,{" "}
                  {user?.name?.split(" ")[0] || "User"}.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                  Manage and monitor your vehicle inventory
                  from one centralized platform.
                </p>

              </div>

              <button
                onClick={handleOpenAddModal}
                className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition duration-200 hover:bg-red-500 active:scale-[0.98]"
              >
                Add Vehicle
              </button>

            </section>

            {/* STATISTICS */}
            <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* TOTAL VEHICLES */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.05]">

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                  Total Vehicles
                </p>

                <p className="mt-5 text-3xl font-semibold text-white">
                  {totalVehicles}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Vehicles in your inventory
                </p>

              </div>

              {/* TOTAL MILEAGE */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.05]">

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                  Total Mileage
                </p>

                <p className="mt-5 text-3xl font-semibold text-white">
                  {totalMileage.toLocaleString()}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Combined vehicle mileage
                </p>

              </div>

              {/* PETROL VEHICLES */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.05]">

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                  Petrol Vehicles
                </p>

                <p className="mt-5 text-3xl font-semibold text-white">
                  {petrolVehicles}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Petrol-powered vehicles
                </p>

              </div>

              {/* OTHER FUEL */}
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-6 backdrop-blur-xl transition hover:border-red-500/40 hover:bg-red-500/[0.07]">

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-red-300/70">
                  Other Fuel Types
                </p>

                <p className="mt-5 text-3xl font-semibold text-white">
                  {otherFuelVehicles}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Diesel, electric and hybrid
                </p>

              </div>

            </section>

            {/* VEHICLES */}
            <section
              id="vehicles-section"
              className="mt-12"
            >

              <div className="flex items-end justify-between">

                <div>

                  <h2 className="text-2xl font-semibold text-white">
                    My Vehicles
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    View and manage your vehicle inventory.
                  </p>

                </div>

                <span className="hidden text-sm text-gray-500 sm:block">
                  {vehicles.length} vehicle
                  {vehicles.length !== 1 ? "s" : ""}
                </span>

              </div>

              {/* LOADING */}
              {loading ? (

                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] py-20 text-center text-sm text-gray-500">
                  Loading your vehicles...
                </div>

              ) : vehicles.length === 0 ? (

                /* EMPTY STATE */
                <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center">

                  <h3 className="text-lg font-medium text-white">
                    No vehicles added yet
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                    Start building your dealership inventory by
                    adding your first vehicle.
                  </p>

                  <button
                    onClick={handleOpenAddModal}
                    className="mt-6 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                  >
                    Add Your First Vehicle
                  </button>

                </div>

              ) : (

                /* VEHICLE GRID */
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {vehicles.map((vehicle) => (

                    <div
                      key={vehicle.id}
                      className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                    >

                      {/* BRAND */}
                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-xs font-medium uppercase tracking-[0.18em] text-red-400">
                            {vehicle.brand}
                          </p>

                          <h3 className="mt-3 text-xl font-semibold text-white">
                            {vehicle.model}
                          </h3>

                        </div>

                        <span className="rounded-md border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-400">
                          {vehicle.fuelType}
                        </span>

                      </div>

                      {/* DIVIDER */}
                      <div className="my-6 h-px bg-white/10" />

                      {/* VEHICLE DETAILS */}
                      <div className="grid grid-cols-2 gap-5">

                        <div>

                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Year
                          </p>

                          <p className="mt-2 text-sm font-medium text-white">
                            {vehicle.year}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Mileage
                          </p>

                          <p className="mt-2 text-sm font-medium text-white">
                            {Number(
                              vehicle.mileage || 0
                            ).toLocaleString()}{" "}
                            km
                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-5">

                        <button
                          onClick={() =>
                            navigate(
                              `/vehicles/${vehicle.id}`
                            )
                          }
                          className="flex-1 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() =>
                            handleEdit(vehicle)
                          }
                          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(vehicle.id)
                          }
                          className="rounded-lg border border-red-500/20 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </div>

        </main>

      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0b0b]/95 p-6 shadow-2xl sm:p-8">

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-6">

              <div>

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-red-400">
                  Vehicle Management
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {editingId
                    ? "Edit Vehicle"
                    : "Add New Vehicle"}
                </h2>

              </div>

              <button
                onClick={handleCloseModal}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleVehicleSubmit}
              className="mt-8 space-y-5"
            >

              {/* BRAND */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Brand
                </label>

                <input
                  type="text"
                  placeholder="Enter vehicle brand"
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:bg-white/[0.07] focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />

              </div>

              {/* MODEL */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Model
                </label>

                <input
                  type="text"
                  placeholder="Enter vehicle model"
                  value={model}
                  onChange={(e) =>
                    setModel(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:bg-white/[0.07] focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />

              </div>

              {/* YEAR AND MILEAGE */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Year
                  </label>

                  <input
                    type="number"
                    placeholder="2026"
                    value={year}
                    onChange={(e) =>
                      setYear(e.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Mileage
                  </label>

                  <input
                    type="number"
                    placeholder="Enter mileage"
                    value={mileage}
                    onChange={(e) =>
                      setMileage(e.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                  />

                </div>

              </div>

              {/* FUEL TYPE */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Fuel Type
                </label>

                <select
                  value={fuelType}
                  onChange={(e) =>
                    setFuelType(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-white/15 bg-[#151515] px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">
                    Select fuel type
                  </option>

                  <option value="Petrol">
                    Petrol
                  </option>

                  <option value="Diesel">
                    Diesel
                  </option>

                  <option value="Electric">
                    Electric
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>

                </select>

              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.98]"
                >
                  {editingId
                    ? "Save Changes"
                    : "Add Vehicle"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
      {/* AI Assistant Button */}
<button
  onClick={() => setAiOpen(true)}
  className="
    fixed
    bottom-6
    right-6
    z-40
    flex
    items-center
    gap-3
    rounded-xl
    border
    border-red-500/30
    bg-zinc-900
    px-5
    py-4
    text-sm
    font-medium
    text-white
    shadow-2xl
    shadow-black/50
    transition
    duration-200
    hover:border-red-500/60
    hover:bg-zinc-800
  "
>
  <span
    className="
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-lg
      bg-red-600
      font-semibold
    "
  >
    AI
  </span>

  DriveCore Assistant
</button>


{/* AI Assistant Panel */}
{aiOpen && (
  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-end
      justify-end
      bg-black/40
      p-4
      backdrop-blur-sm
      sm:p-6
    "
  >
    <div
      className="
        flex
        h-[700px]
        max-h-[90vh]
        w-full
        max-w-xl
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-zinc-950
        shadow-2xl
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          bg-zinc-900/70
          px-6
          py-5
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-red-600
              text-sm
              font-bold
              text-white
            "
          >
            AI
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              DriveCore AI Assistant
            </h2>

            <p className="mt-1 text-xs text-zinc-400">
              Ask questions about your inventory
            </p>
          </div>
        </div>

        <button
          onClick={() => setAiOpen(false)}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-zinc-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          ×
        </button>
      </div>


      {/* Chat Area */}
      <div
        className="
          flex-1
          space-y-5
          overflow-y-auto
          px-5
          py-6
        "
      >
        {aiMessages.length === 0 && (
          <div className="flex h-full flex-col justify-center">

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white">
                Inventory Intelligence
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                Ask DriveCore AI about vehicle availability,
                stock levels, categories, pricing, and your
                dealership inventory.
              </p>
            </div>


            {/* Suggested Questions */}
            <div className="grid gap-3">
              {[
                "Which vehicles have low stock?",
                "Show me all vehicles currently in inventory",
                "Which vehicles are out of stock?",
                "Give me an inventory summary",
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => handleAskAI(question)}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-4
                    py-4
                    text-left
                    text-sm
                    text-zinc-300
                    transition
                    hover:border-red-500/40
                    hover:bg-red-500/5
                    hover:text-white
                  "
                >
                  {question}
                </button>
              ))}
            </div>

          </div>
        )}


        {/* Chat Messages */}
        {aiMessages.map((message, index) => (
          <div
            key={index}
            className={`
              flex
              ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }
            `}
          >
            <div
              className={`
                max-w-[85%]
                whitespace-pre-line
                rounded-2xl
                px-4
                py-3
                text-sm
                leading-6
                ${
                  message.role === "user"
                    ? "bg-red-600 text-white"
                    : "border border-white/10 bg-zinc-900 text-zinc-200"
                }
              `}
            >
              {message.content}
            </div>
          </div>
        ))}


        {/* Loading */}
        {aiLoading && (
          <div className="flex justify-start">
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-zinc-900
                px-4
                py-3
                text-sm
                text-zinc-400
              "
            >
              Analyzing your inventory...
            </div>
          </div>
        )}
      </div>


      {/* Input */}
      <div
        className="
          border-t
          border-white/10
          bg-zinc-950
          p-4
        "
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAI();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            placeholder="Ask about your inventory..."
            disabled={aiLoading}
            className="
              flex-1
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-zinc-500
              focus:border-red-500/60
              focus:ring-2
              focus:ring-red-500/10
              disabled:opacity-50
            "
          />

          <button
            type="submit"
            disabled={!aiMessage.trim() || aiLoading}
            className="
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-red-500
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Send
          </button>
        </form>
      </div>

    </div>
  </div>
)}
    </div>
  );
}

export default Dashboard;