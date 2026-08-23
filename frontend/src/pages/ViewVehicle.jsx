import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ViewVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicle(response.data.vehicle);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to fetch vehicle"
      );

      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        Loading vehicle details...
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-10">

      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] shadow-2xl">

          {/* Header */}
          <div className="border-b border-white/10 px-6 py-6 sm:px-10">

            <p className="text-sm uppercase tracking-[0.2em] text-red-500">
              Vehicle Details
            </p>

            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {vehicle.make} {vehicle.model}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Complete inventory information
            </p>

          </div>

          {/* Details */}
          <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-10">

            <DetailCard
              label="Make"
              value={vehicle.make}
            />

            <DetailCard
              label="Model"
              value={vehicle.model}
            />

            <DetailCard
              label="Category"
              value={vehicle.category}
            />

            <DetailCard
              label="Price"
              value={`₹${Number(vehicle.price).toLocaleString()}`}
            />

            <DetailCard
              label="Quantity"
              value={vehicle.quantity}
            />

          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row sm:justify-end sm:p-10">

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              Back
            </button>

            <button
              onClick={() =>
                navigate(`/vehicles/edit/${vehicle.id}`)
              }
              className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.99]"
            >
              Edit Vehicle
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-lg font-medium text-white">
        {value}
      </p>

    </div>
  );
}

export default ViewVehicle;