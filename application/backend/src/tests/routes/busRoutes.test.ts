import request from "supertest";
import express from "express";
import busRoutes from "../../routes/busRoutes";

// Mock the entire controller module so route triggers don't fail
jest.mock("../../controllers/busController", () => ({
  getBusArrivalHandler: (req: any, res: any) => res.status(200).json({ route: "bus-arrival" }),
  getNearbyBusStopsHandler: (req: any, res: any) => res.status(200).json({ route: "nearby-bus-stops" }),
  getBusStopDetailsHandler: (req: any, res: any) => res.status(200).json({ route: "busStopCode", code: req.params.busStopCode }),
}));

const app = express();
app.use("/api/bus", busRoutes);

describe("busRoutes.ts", () => {
  it("should route GET /api/bus/bus-arrival to getBusArrivalHandler", async () => {
    const res = await request(app).get("/api/bus/bus-arrival");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("bus-arrival");
  });

  it("should route GET /api/bus/nearby-bus-stops to getNearbyBusStopsHandler", async () => {
    const res = await request(app).get("/api/bus/nearby-bus-stops");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("nearby-bus-stops");
  });

  it("should route GET /api/bus/:busStopCode to getBusStopDetailsHandler", async () => {
    const res = await request(app).get("/api/bus/12345");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "busStopCode", code: "12345" });
  });
});
