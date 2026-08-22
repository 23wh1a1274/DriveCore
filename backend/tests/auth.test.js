const request = require("supertest");
const app = require("../src/app");

describe("POST /api/auth/register", () => {
  const email = `test${Date.now()}@example.com`;

  it("should register a new user successfully", async () => {
    const userData = {
      name: "Tanishqa",
      email: email,
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.statusCode).toBe(201);

    expect(response.body).toMatchObject({
      message: "User registered successfully",
      user: {
        name: "Tanishqa",
        email: email,
        role: "USER",
      },
    });

    expect(response.body.user.id).toBeDefined();
  });

  it("should not register a user with an existing email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: email,
        password: "password123",
      });

    expect(response.statusCode).toBe(409);

    expect(response.body).toEqual({
      message: "Email already registered",
    });
  });
});

describe("POST /api/auth/login", () => {
  it("should login successfully with valid credentials", async () => {
    const email = `login${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login Test User",
        email,
        password,
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty(
      "message",
      "Login successful"
    );

    expect(response.body).toHaveProperty("token");

    expect(response.body.user).toMatchObject({
      name: "Login Test User",
      email,
      role: "USER",
    });
  });
});