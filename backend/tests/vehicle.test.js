const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("POST /api/vehicles", () => {
  it("should create a new vehicle successfully", async () => {
    const email = `vehicle${Date.now()}@example.com`;
    const password = "password123";

    // Register a user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vehicle Test User",
        email,
        password,
      });

    expect(registerResponse.statusCode).toBe(201);

    // Login to get JWT token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    expect(loginResponse.statusCode).toBe(200);

    const token = loginResponse.body.token;

    // Create vehicle
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 25000,
        quantity: 5,
      });

    // Expected result
    expect(response.statusCode).toBe(201);

    expect(response.body).toMatchObject({
      message: "Vehicle added successfully",
      vehicle: {
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 25000,
        quantity: 5,
      },
    });

    expect(response.body.vehicle.id).toBeDefined();
    // Assertions
    expect(registerResponse.statusCode).toBe(201);
    expect(loginResponse.statusCode).toBe(200);
    expect(response.statusCode).toBe(201);

    expect(response.body).toMatchObject({
      message: "Vehicle added successfully",
      vehicle: {
        brand: "Honda",
        model: "City",
        year: 2022,
        mileage: 15000,
        fuelType: "Petrol",
      },
    });
  });
});

describe("GET /api/vehicles", () => {
  it("should return all vehicles for the authenticated user", async () => {
    const email = `getvehicles${Date.now()}@example.com`;
    const password = "password123";

    // Register user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Get Vehicles User",
        email,
        password,
      });

    // Login user
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    const token = loginResponse.body.token;

    // Add a vehicle for this user
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        brand: "Honda",
        model: "City",
        year: 2022,
        mileage: 15000,
        fuelType: "Petrol",
      });

    // Get all vehicles
    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("vehicles");

    expect(Array.isArray(response.body.vehicles)).toBe(true);

    expect(response.body.vehicles.length).toBeGreaterThan(0);
  });
});

describe("POST /api/vehicles/:id/services", () => {
  it("should add a service record to a vehicle", async () => {
    const email = `service${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Service Test User",
        email,
        password,
      });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    const token = loginResponse.body.token;

    // Create a vehicle first
    const vehicleResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        brand: "Honda",
        model: "City",
        year: 2022,
        mileage: 15000,
        fuelType: "Petrol",
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    // Add service record
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/services`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        serviceType: "Oil Change",
        description: "Engine oil and filter replaced",
        serviceDate: "2026-08-22",
        cost: 2500,
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toMatchObject({
      message: "Service record added successfully",
      serviceRecord: {
        serviceType: "Oil Change",
        description: "Engine oil and filter replaced",
        cost: 2500,
      },
    });
  });
});

describe("GET /api/vehicles/:id/services", () => {
  it("should return service records for a vehicle", async () => {
    const email = `history${Date.now()}@example.com`;
    const password = "password123";

    // Register
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Service History User",
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
        brand: "Hyundai",
        model: "Creta",
        year: 2023,
        mileage: 10000,
        fuelType: "Petrol",
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    // Add a service record
    await request(app)
      .post(`/api/vehicles/${vehicleId}/services`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        serviceType: "General Service",
        description: "Regular maintenance",
        serviceDate: "2026-08-22",
        cost: 3000,
      });

    // Get service history
    const response = await request(app)
      .get(`/api/vehicles/${vehicleId}/services`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("serviceRecords");

    expect(Array.isArray(response.body.serviceRecords)).toBe(true);

    expect(response.body.serviceRecords.length).toBeGreaterThan(0);
  });
});

describe("PUT /api/vehicles/:id", () => {
  it("should update a vehicle for the authenticated user", async () => {
    const email = `update${Date.now()}@example.com`;
    const password = "password123";

    // Register
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Update Vehicle User",
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
        brand: "Honda",
        model: "City",
        year: 2022,
        mileage: 15000,
        fuelType: "Petrol",
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    // Update vehicle
    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        brand: "Honda",
        model: "City ZX",
        year: 2023,
        mileage: 18000,
        fuelType: "Petrol",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toMatchObject({
      message: "Vehicle updated successfully",
      vehicle: {
        brand: "Honda",
        model: "City ZX",
        year: 2023,
        mileage: 18000,
        fuelType: "Petrol",
      },
    });
  });

});

describe("DELETE /api/vehicles/:id", () => {
  it("should delete a vehicle for the authenticated user", async () => {
    const email = `delete${Date.now()}@example.com`;
    const password = "password123";

    // Register
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Delete Vehicle User",
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
        brand: "Hyundai",
        model: "Creta",
        year: 2023,
        mileage: 10000,
        fuelType: "Petrol",
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    // Delete vehicle
    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "Vehicle deleted successfully",
    });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});