const request = require("supertest");
const app = require("../src/app");

describe("POST /api/auth/register", () => {

  it("should register a new user successfully", async () => {
    // existing test
  });

  it("should not register a user with an existing email", async () => {
    const userData = {
      name: "Another User",
      email: "tanishqa@example.com",
      password: "password123"
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.statusCode).toBe(409);

    expect(response.body).toEqual({
      message: "Email already registered"
    });
  });

});