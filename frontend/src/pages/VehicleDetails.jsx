import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/vehicles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVehicle(response.data.vehicle);
      } catch (error) {
        console.error("Failed to fetch vehicle:", error);

        if (error.response?.status === 404) {
          alert("Vehicle not found");
          navigate("/dashboard");
        }

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, token, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b10] text-white">
        Loading vehicle...
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080b10] px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          Back to Dashboard
        </button>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

          <div className="border-b border-white/10 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Vehicle Details
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              {vehicle.make} {vehicle.model}
            </h1>

            <p className="mt-2 text-gray-400">
              Complete inventory information
            </p>
          </div>

          <div className="grid gap-6 p-8 md:grid-cols-2">

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">
                Make
              </p>

              <p className="mt-2 text-lg font-medium">
                {vehicle.make}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">
                Model
              </p>

              <p className="mt-2 text-lg font-medium">
                {vehicle.model}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="mt-2 text-lg font-medium">
                {vehicle.category}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">
                Price
              </p>

              <p className="mt-2 text-lg font-medium">
                ${Number(vehicle.price).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">
                Available Quantity
              </p>

              <p className="mt-2 text-lg font-medium">
                {vehicle.quantity}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;