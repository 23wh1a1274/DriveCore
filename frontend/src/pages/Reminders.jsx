import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api";

  const fetchReminders = async () => {
    try {
      // Get all vehicles of the logged-in user
      const vehicleResponse = await axios.get(
        `${API_URL}/vehicles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userVehicles = vehicleResponse.data.vehicles || [];
      const allReminders = [];

      // Get service records for every vehicle
      for (const vehicle of userVehicles) {
        try {
          const serviceResponse = await axios.get(
            `${API_URL}/vehicles/${vehicle.id}/services`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const services =
            serviceResponse.data.serviceRecords || [];

          services.forEach((service) => {
            if (!service.nextServiceDate) return;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const nextDate = new Date(service.nextServiceDate);
            nextDate.setHours(0, 0, 0, 0);

            const difference = Math.ceil(
              (nextDate - today) /
                (1000 * 60 * 60 * 24)
            );

            // Show overdue or services due within 30 days
            if (difference <= 30) {
              allReminders.push({
                ...service,
                vehicleBrand: vehicle.brand,
                vehicleModel: vehicle.model,
                daysRemaining: difference,
              });
            }
          });
        } catch (error) {
          console.error(
            `Failed to fetch services for vehicle ${vehicle.id}`,
            error
          );
        }
      }

      // Sort reminders by nearest service date
      allReminders.sort(
        (a, b) =>
          a.daysRemaining - b.daysRemaining
      );

      setReminders(allReminders);
    } catch (error) {
      console.error("Failed to fetch reminders", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const getReminderStatus = (daysRemaining) => {
    if (daysRemaining < 0) {
      return `Overdue by ${Math.abs(
        daysRemaining
      )} day(s)`;
    }

    if (daysRemaining === 0) {
      return "Due today";
    }

    return `Due in ${daysRemaining} day(s)`;
  };

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>Service Reminders 🔔</h1>

      {reminders.length === 0 ? (
        <p>No upcoming or overdue service reminders.</p>
      ) : (
        reminders.map((reminder) => (
          <div
            key={`${reminder.vehicleId}-${reminder.id}`}
            style={{
              border: "1px solid black",
              padding: "15px",
              margin: "10px",
            }}
          >
            <h3>
              {reminder.vehicleBrand}{" "}
              {reminder.vehicleModel}
            </h3>

            <p>
              Service: {reminder.serviceType}
            </p>

            <p>
              Next Service Date:{" "}
              {new Date(
                reminder.nextServiceDate
              ).toLocaleDateString()}
            </p>

            <strong>
              {getReminderStatus(
                reminder.daysRemaining
              )}
            </strong>
          </div>
        ))
      )}
    </div>
  );
}

export default Reminders;