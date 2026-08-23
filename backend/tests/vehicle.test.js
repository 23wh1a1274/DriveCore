const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("POST /api/vehicles", () => {
  it("should create a new vehicle successfully", async () => {
    const email = `vehicle${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vehicle Test User",
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
  });
});

describe("GET /api/vehicles", () => {
  it("should return vehicles for the authenticated user", async () => {
    const email = `getvehicles${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Get Vehicles User",
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

    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 22000,
        quantity: 3,
      });

    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("vehicles");
    expect(Array.isArray(response.body.vehicles)).toBe(true);
    expect(response.body.vehicles.length).toBeGreaterThan(0);
  });
});

describe("GET /api/vehicles - dealership inventory", () => {
  it("should allow another authenticated user to view all vehicles", async () => {
    const timestamp = Date.now();

    const ownerEmail = `owner${timestamp}@example.com`;
    const viewerEmail = `viewer${timestamp}@example.com`;
    const password = "password123";

    // Register vehicle owner
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vehicle Owner",
        email: ownerEmail,
        password,
      });

    // Login as owner
    const ownerLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: ownerEmail,
        password,
      });

    const ownerToken = ownerLogin.body.token;

    // Owner adds a vehicle
    const vehicleResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 50000,
        quantity: 2,
      });

    expect(vehicleResponse.statusCode).toBe(201);

    // Register another user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vehicle Viewer",
        email: viewerEmail,
        password,
      });

    // Login as another user
    const viewerLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: viewerEmail,
        password,
      });

    const viewerToken = viewerLogin.body.token;

    // Viewer should see the dealership inventory
    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${viewerToken}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          make: "Toyota",
          model: "Fortuner",
          category: "SUV",
          price: 50000,
          quantity: 2,
        }),
      ])
    );
  });
});

describe("GET /api/vehicles/:id", () => {
  it("should return a specific vehicle for the authenticated user", async () => {
    const email = `single${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Single Vehicle User",
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

    const vehicleResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Hyundai",
        model: "Creta",
        category: "SUV",
        price: 30000,
        quantity: 4,
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    const response = await request(app)
      .get(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.vehicle).toMatchObject({
      id: vehicleId,
      make: "Hyundai",
      model: "Creta",
      category: "SUV",
      price: 30000,
      quantity: 4,
    });
  });
});

describe("PUT /api/vehicles/:id", () => {
  it("should update a vehicle for the authenticated user", async () => {
    const email = `update${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Update Vehicle User",
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

    const vehicleResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 22000,
        quantity: 3,
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Honda",
        model: "City ZX",
        category: "Sedan",
        price: 26000,
        quantity: 6,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toMatchObject({
      message: "Vehicle updated successfully",
      vehicle: {
        make: "Honda",
        model: "City ZX",
        category: "Sedan",
        price: 26000,
        quantity: 6,
      },
    });
  });
});

describe("DELETE /api/vehicles/:id", () => {
  it("should delete a vehicle for the authenticated user", async () => {
    const email = `delete${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Delete Vehicle User",
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

    const vehicleResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Hyundai",
        model: "Creta",
        category: "SUV",
        price: 30000,
        quantity: 4,
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "Vehicle deleted successfully",
    });
  });
});

describe("GET /api/vehicles/search", () => {
  it("should search vehicles by make", async () => {
    const email = `search${Date.now()}@example.com`;
    const password = "password123";

    // Register user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Search Test User",
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

    // Add Toyota
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 50000,
        quantity: 2,
      });

    // Add Honda
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 25000,
        quantity: 5,
      });

    // Search for Toyota
    const response = await request(app)
      .get("/api/vehicles/search?make=Toyota")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          make: "Toyota",
          model: "Fortuner",
        }),
      ])
    );

    expect(
      response.body.vehicles.every(
        (vehicle) => vehicle.make.toLowerCase() === "toyota"
      )
    ).toBe(true);
  });
});

describe("POST /api/vehicles/:id/purchase", () => {
  it("should purchase a vehicle and decrease its quantity", async () => {
    const email = `purchase${Date.now()}@example.com`;
    const password = "password123";

    // Register user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Purchase Test User",
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

    // Create vehicle with quantity 5
    const vehicleResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 50000,
        quantity: 5,
      });

    const vehicleId = vehicleResponse.body.vehicle.id;

    // Purchase the vehicle
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toMatchObject({
      message: "Vehicle purchased successfully",
      vehicle: {
        id: vehicleId,
        quantity: 4,
      },
    });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});