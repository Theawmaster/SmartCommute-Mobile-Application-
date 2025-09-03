import request from "supertest";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import feedbackRoutesTest from "../tests/routes/feedbackRoutesTest";

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
app.use("/api/test/feedback", feedbackRoutesTest);

describe("Feedback API", () => {
  // Reset the in-memory users store before each test
  beforeEach(() => {
    users = [];
  });

  describe("POST /submitfeedbackCookie", () => {
    it("should submit feedback for an authenticated user", async () => {
      const User = (await import("../models/User")).default;
      // Create a verified user and generate a token
      const user = new User({
        username: "feedbackUser",
        email: "feedback@example.com",
        password: "pass",
        isVerified: true,
        feedbacks: [],
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });

      const res = await request(app)
        .post("/api/test/feedback/submitfeedbackCookie")
        .set("Cookie", [`authToken=${token}`])
        .send({ message: "Great service", rating: 5 });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Feedback submitted successfully");

      const updatedUser = await User.findOne({ username: "feedbackUser" });
      if (!updatedUser) {
        throw new Error("User not found");
      }
      expect(updatedUser.feedbacks.length).toBe(1);
      expect(updatedUser.feedbacks[0].message).toBe("Great service");
    });

    it("should return an error if no token is provided", async () => {
      const res = await request(app)
        .post("/api/test/feedback/submitfeedbackCookie")
        .send({ message: "Great service", rating: 5 });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Access denied. No token provided.");
    });
  });

  describe("GET /retrievefeedbacksCookie", () => {
    it("should return an error if not logged in", async () => {
      const res = await request(app).get("/api/test/feedback/retrievefeedbacksCookie").send();
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthorized: Please log in to view feedback.");
    });

    it("should return an error if a non-admin user tries to access feedbacks", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "normalUser",
        email: "normal@example.com",
        password: "pass",
        isVerified: true,
        isAdmin: false,
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });

      const res = await request(app)
        .get("/api/test/feedback/retrievefeedbacksCookie")
        .set("Cookie", [`authToken=${token}`])
        .send();
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Access denied. Only admins can retrieve feedbacks.");
    });

    it("should retrieve all feedbacks for an admin user", async () => {
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

      const userWithFeedback = new User({
        username: "userFeedback",
        email: "userf@example.com",
        password: "pass",
        isVerified: true,
        feedbacks: [{ message: "Nice", rating: 4, createdAt: new Date() }],
      });
      await userWithFeedback.save();

      const res = await request(app)
        .get("/api/test/feedback/retrievefeedbacksCookie")
        .set("Cookie", [`authToken=${token}`])
        .send();
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("All feedbacks retrieved successfully");
      expect(Array.isArray(res.body.feedbackData)).toBe(true);
      expect(res.body.feedbackData.length).toBe(1);
      expect(res.body.feedbackData[0].username).toBe("userFeedback");
    });
  });
});