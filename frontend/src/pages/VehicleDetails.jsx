import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [cost, setCost] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchVehicle = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/vehicles/${id}`,
        { headers }
      );

      setVehicle(response.data.vehicle);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load vehicle"
      );
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/vehicles/${id}/services`,
        { headers }
      );

      setServices(response.data.serviceRecords || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicle();
    fetchServices();
  }, [id]);

  const handleAddService = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/vehicles/${id}/services`,
        {
          serviceType,
          description,
          serviceDate,
          nextServiceDate: nextServiceDate || null,
          cost: Number(cost),
        },
        { headers }
      );

      alert("Service record added successfully!");

      setServiceType("");
      setDescription("");
      setServiceDate("");
      setNextServiceDate("");
      setCost("");

      fetchServices();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to add service record"
      );
    }
  };

  if (error) {
    return (
      <div>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>

        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>

        <p>Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>
        {vehicle.brand} {vehicle.model}
      </h1>

      <p>Year: {vehicle.year}</p>
      <p>Mileage: {vehicle.mileage} km</p>
      <p>Fuel Type: {vehicle.fuelType}</p>

      <hr />

      <h2>Add Service Record</h2>

      <form onSubmit={handleAddService}>
        <input
          type="text"
          placeholder="Service Type"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <label>Service Date</label>
        <br />

        <input
          type="date"
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
          required
        />

        <br /><br />

        <label>Next Service Date</label>
        <br />

        <input
          type="date"
          value={nextServiceDate}
          onChange={(e) => setNextServiceDate(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">
          Add Service Record
        </button>
      </form>

      <hr />

      <h2>Service History</h2>

      {services.length === 0 ? (
        <p>No service records found.</p>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            style={{
              border: "1px solid black",
              padding: "15px",
              margin: "10px",
            }}
          >
            <h3>{service.serviceType}</h3>

            <p>
              Description: {service.description || "No description"}
            </p>

            <p>
              Service Date:{" "}
              {new Date(service.serviceDate).toLocaleDateString()}
            </p>

            {service.nextServiceDate && (
              <p>
                Next Service:{" "}
                {new Date(
                  service.nextServiceDate
                ).toLocaleDateString()}
              </p>
            )}

            <p>Cost: ₹{service.cost}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default VehicleDetails;