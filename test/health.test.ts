import supertest from "supertest";
import { web } from "../src/application/web";

describe("GET /", () => {
    it("responds with a hello message", async () => {
        const res = await supertest(web).get("/");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Hello from Express + TypeScript!");
    });
});

describe("GET /health", () => {
    it("responds with status ok", async () => {
        const res = await supertest(web).get("/health");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
    });
});
