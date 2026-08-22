const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("POST /api/vehicles", () => {
  it("should add a vehicle for an authenticated user", async () => {
    const email = `vehicle${Date.now()}@example.com`;
    const password = "password123";

    // Register user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vehicle Test User",
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

    // Add vehicle
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        brand: "Honda",
        model: "City",
        year: 2022,
        mileage: 15000,
        fuelType: "Petrol",
      });

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

afterAll(async () => {
  await prisma.$disconnect();
});