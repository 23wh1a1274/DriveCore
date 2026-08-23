import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Fetching vehicle ID:", id);

      const response = await axios.get(
        `http://localhost:5000/api/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Vehicle response:", response.data);

      const vehicle = response.data.vehicle;

      setFormData({
        make: vehicle.make ?? "",
        model: vehicle.model ?? "",
        category: vehicle.category ?? "",
        price: vehicle.price ?? "",
        quantity: vehicle.quantity ?? "",
      });
    } catch (error) {
      console.error("Fetch vehicle error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch vehicle"
      );

      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const dataToSend = {
        make: formData.make,
        model: formData.model,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };

      console.log("Updating vehicle:", id);
      console.log("Data:", dataToSend);

      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);

      alert("Vehicle updated successfully");

      navigate(`/vehicles/${id}`);
    } catch (error) {
      console.error("Update error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update vehicle"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        Loading vehicle...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-10">

      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate(`/vehicles/${id}`)}
          className="mb-8 text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Vehicle Details
        </button>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0d] shadow-2xl">

          <div className="border-b border-white/10 px-6 py-6 sm:px-10">

            <p className="text-sm uppercase tracking-[0.2em] text-red-500">
              Inventory Management
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Edit Vehicle
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Update the vehicle information below.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-10"
          >

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Make
              </label>

              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Model
              </label>

              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate(`/vehicles/${id}`)}
                className="rounded-lg border border-white/10 px-6 py-3.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-red-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditVehicle;