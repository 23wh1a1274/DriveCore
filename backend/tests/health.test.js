const request = require("supertest");
const app = require("../src/app");

describe("GET /api/health", () => {
  it("should return 200 and confirm the API is healthy", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "ok"
    });
  });
});