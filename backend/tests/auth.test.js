const request = require("supertest");
const app = require("../src/app");

describe("POST /api/auth/register", () => {
  it("should register a new user successfully", async () => {
    const userData = {
      name: "Tanishqa",
      email: "tanishqa@example.com",
      password: "password123"
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.statusCode).toBe(201);

    expect(response.body).toMatchObject({
      message: "User registered successfully",
      user: {
        name: "Tanishqa",
        email: "tanishqa@example.com",
        role: "USER"
      }
    });

    expect(response.body.user.id).toBeDefined();
  });
});