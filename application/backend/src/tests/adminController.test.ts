import request from "supertest";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import adminRoutes from "../routes/adminRoutes";

// In-memory users store to simulate the database.
// We will override the User model’s methods using jest.
let users: any[] = [];

// Mock the User model
jest.mock("../models/User", () => {
  class User {
    _id: string;
    username!: string;
    email!: string;
    password!: string;
    isVerified!: boolean;
    verificationToken!: string;
    isAdmin!: boolean;
    feedbacks!: any[];

    constructor(data: any) {
      Object.assign(this, data);
      this.feedbacks = data.feedbacks || [];
      // simulate _id creation if not provided
      this._id = data._id || (Math.random() * 100000).toString();
    }
    static async findOne(query: any) {
      if (query.email) {
        return users.find((user) => user.email === query.email) || null;
      }
      if (query.username) {
        return users.find((user) => user.username === query.username) || null;
      }
      if (query.verificationToken) {
        return (
          users.find((user) => user.verificationToken === query.verificationToken) ||
          null
        );
      }
      if (query._id) {
        return users.find((user) => user._id === query._id) || null;
      }
      return null;
    }
    static find(query: any) {
      let results = [];
      if (query.feedbacks) {
        results = users.filter((user) => user.feedbacks && user.feedbacks.length > 0);
      }
      // Return a query-like object with a .select() method
      return {
        select: (fields: string) => {
          const fieldList = fields.split(" ").filter(Boolean);
          const mappedResults = results.map((user) => {
            const newUser: any = {};
            fieldList.forEach((field) => {
              newUser[field] = user[field];
            });
            return newUser;
          });
          return Promise.resolve(mappedResults);
        },
      };
    }
    static async findById(id: string) {
      return users.find((user) => user._id === id) || null;
    }
    async save() {
      const index = users.findIndex((u: any) => u._id === this._id);
      if (index > -1) {
        users[index] = this;
      } else {
        users.push(this);
      }
      return this;
    }
    comparePassword(password: string) {
      // For testing, assume the stored password is in plain text.
      return Promise.resolve(this.password === password);
    }
  }
  return User;
});

// Mock nodemailer so no real email is sent during tests
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((mailOptions: any, callback: Function) => {
      callback(null, { response: "Email sent" });
    }),
  })),
}));

// Set up the express app with required middleware and mount the auth routes.
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "testsessionsecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/api/admin", adminRoutes);

describe("Admin API", () => {
  // Reset the in-memory users store before each test
  beforeEach(() => {
    users = [];
  });

  describe("POST /make-admin", () => {
    it("should return an error if not authenticated", async () => {
      const res = await request(app)
        .post("/api/admin/make-admin")
        .send({ username: "someUser" });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthorized: Please log in as an admin.");
    });

    it("should promote a user to admin", async () => {
      const User = (await import("../models/User")).default;
      const adminUser = new User({
        username: "adminUser",
        email: "admin@example.com",
        password: "pass",
        isVerified: true,
        isAdmin: true,
      });
      await adminUser.save();
      const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });

      const normalUser = new User({
        username: "normalUser",
        email: "normal@example.com",
        password: "pass",
        isVerified: true,
        isAdmin: false,
      });
      await normalUser.save();

      const res = await request(app)
        .post("/api/admin/make-admin")
        .set("Cookie", [`authToken=${token}`])
        .send({ username: "normalUser" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User normalUser is now an admin.");

      const updatedUser = await User.findOne({ username: "normalUser" });
      expect(updatedUser!.isAdmin).toBe(true);
    });

    it("should return an error if the user is already an admin", async () => {
      const User = (await import("../models/User")).default;
      const adminUser = new User({
        username: "adminUser",
        email: "admin@example.com",
        password: "pass",
        isVerified: true,
        isAdmin: true,
      });
      await adminUser.save();
      const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });

      const otherAdmin = new User({
        username: "otherAdmin",
        email: "otheradmin@example.com",
        password: "pass",
        isVerified: true,
        isAdmin: true,
      });
      await otherAdmin.save();

      const res = await request(app)
        .post("/api/admin/make-admin")
        .set("Cookie", [`authToken=${token}`])
        .send({ username: "otherAdmin" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("User is already an admin.");
    });
    it("should return an error if the user does not exist", async () => {
      const User = (await import("../models/User")).default;
      const adminUser = new User({
        username: "adminUser",
        email: "admin@example.com",
        password: "pass",
        isVerified: true,
        isAdmin: true,
      });
      await adminUser.save();
      const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });
      const res = await request(app)
        .post("/api/admin/make-admin")
        .set("Cookie", [`authToken=${token}`])
        .send({ username: "doesNotExist" });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found.");
    });
  });

  describe("POST /make-premium", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app)
        .post("/api/admin/make-premium")
        .send({ premium: true });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthorized: Please log in!");
    });
  
    it("should return 400 if premium flag is not true", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "testUser",
        email: "testUser@example.com",
        password: "pass",
        isVerified: true,
        isPremium: false,
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  
      const res = await request(app)
        .post("/api/admin/make-premium")
        .set("Cookie", [`authToken=${token}`])
        .send({ premium: false });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid premium value. It must be true to promote a user.");
    });
  
    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .post("/api/admin/make-premium")
        .set("Authorization", "Bearer invalidtoken")
        .send({ premium: true });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token.");
    });
  
    it("should return 404 if user is not found", async () => {
      const fakeId = "nonexistingid";
      const token = jwt.sign({ id: fakeId }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
      const res = await request(app)
        .post("/api/admin/make-premium")
        .set("Cookie", [`authToken=${token}`])
        .send({ premium: true });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found.");
    });
  
    it("should return 400 if user is already a premium member", async () => {
      const User = (await import("../models/User")).default;
      const premiumUser = new User({
        username: "premiumUser",
        email: "premiumUser@example.com",
        password: "pass",
        isVerified: true,
        isPremium: true,
      });
      await premiumUser.save();
      const token = jwt.sign({ id: premiumUser._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
      const res = await request(app)
        .post("/api/admin/make-premium")
        .set("Cookie", [`authToken=${token}`])
        .send({ premium: true });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("User is already a premium member.");
    });
  
    it("should promote user to premium successfully", async () => {
      const User = (await import("../models/User")).default;
      const normalUser = new User({
        username: "normalUser",
        email: "normalUser@example.com",
        password: "pass",
        isVerified: true,
        isPremium: false,
      });
      await normalUser.save();
      const token = jwt.sign({ id: normalUser._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
      const res = await request(app)
        .post("/api/admin/make-premium")
        .set("Cookie", [`authToken=${token}`])
        .send({ premium: true });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("is now a premium member");
      expect(res.body.token).toBeDefined();
  
      const updatedUser = await User.findById(normalUser._id);
      expect(updatedUser?.isPremium).toBe(true);
    });
  });  
});