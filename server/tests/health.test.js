import request from "supertest";
import app from "../src/app.js";
import { connect, close } from "./db.js";

beforeAll(connect, 60000);
afterAll(close);

test("GET /health returns ok with DB connected", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
})