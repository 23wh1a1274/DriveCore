const request = require("supertest");
const app = require("../src/app");

describe("GET /api/reminders", () => {
  it("should return upcoming service reminders for the authenticated user", async () => {
    const email = `reminder${Date.now()}@example.com`;
    const password = "password123";

    // Register user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Reminder Test User",
        email,
        password,
      });

    // Login
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    const token = loginResponse.body.token;

    // Create vehicle
    const vehicleResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        brand: "Toyota",
        model: "Innova",
        year: 2023,
        mileage: 12000,
        fuelType: "Diesel",
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    // Add service record with next service date
    await request(app)
      .post(`/api/vehicles/${vehicleId}/services`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        serviceType: "General Service",
        description: "Regular maintenance",
        serviceDate: "2026-08-01",
        nextServiceDate: "2026-09-01",
        cost: 3000,
      });

    // Get reminders
    const response = await request(app)
      .get("/api/reminders")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("reminders");
    expect(Array.isArray(response.body.reminders)).toBe(true);
  });
});