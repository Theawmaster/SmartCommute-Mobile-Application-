import request from "supertest";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import authRoutes from "../routes/authRoutes";
import User from "../models/User";

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
app.use("/api/auth", authRoutes);

describe("Auth API", () => {
  // Reset the in-memory users store before each test
  beforeEach(() => {
    users = [];
  });

  describe("POST /register", () => {
    it("should register a new user and send an OTP email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered. Please verify your email.");

      const user = await User.findOne({ email: "test@example.com" });
      expect(user).not.toBeNull();
      expect(user!.isVerified).toBe(false);
      expect(user!.verificationToken).toBeDefined();
    });

    it("should not register if email already exists", async () => {
      // Pre-create an existing user
      const existingUser = new (await import("../models/User")).default({
        username: "existing",
        email: "exist@example.com",
        password: "pass",
        isVerified: true,
      });
      await existingUser.save();

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          username: "newuser",
          email: "exist@example.com",
          password: "password123",
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email already in use");
    });

    it("should not register if username already exists", async () => {
      // Pre-create an existing user
      const existingUser = new (await import("../models/User")).default({
        username: "existing",
        email: "exist@example.com",
        password: "pass",
        isVerified: true,
      });
      await existingUser.save();

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          username: "existing",
          email: "exist123@example.com",
          password: "password123",
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username already in use");
    }); 
  });

  describe("POST /verify", () => {
    it("should verify email with a correct OTP", async () => {
      // Create a user with a known OTP
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "verifyUser",
        email: "verify@example.com",
        password: "pass",
        verificationToken: "123456",
        isVerified: false,
      });
      await user.save();

      const res = await request(app).post("/api/auth/verify").send({ otp: "123456" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Email verified successfully");

      const updatedUser = await User.findOne({ email: "verify@example.com" });
      expect(updatedUser!.isVerified).toBe(true);
      expect(updatedUser!.verificationToken).toBe("");
    });

    it("should return an error for an invalid OTP", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "verifyUser",
        email: "verify@example.com",
        password: "pass",
        verificationToken: "123456",
        isVerified: false,
      });
      await user.save();

      const res = await request(app).post("/api/auth/verify").send({ otp: "000000" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid or expired OTP");
    });
  });

  describe("POST /login", () => {
    it("should return an error if the user is not found", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "nonexistent", password: "pass" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User not found");
    });

    it("should return an error if the email is not verified", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "unverified",
        email: "unverified@example.com",
        password: "pass",
        isVerified: false,
      });
      await user.save();

      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "unverified", password: "pass" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email not verified");
    });

    it("should send an OTP after login", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "loginUser",
        email: "login@example.com",
        password: "pass",
        isVerified: true,
        verificationToken: "",
      });
      await user.save();

      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "loginUser", password: "pass" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("OTP sent to your email.");

      const updatedUser = await User.findOne({ username: "loginUser" });
      expect(updatedUser!.verificationToken).not.toBe("");
    });

    it("should return an error when a wrong password is provided", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "loginUser",
        email: "login@example.com",
        password: "pass",
        isVerified: true,
      });
      await user.save();

      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "loginUser", password: "wrongpass" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return an error when a wrong OTP is provided", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "loginUser",
        email: "login@example.com",
        password: "pass",
        isVerified: true,
        verificationToken: "111111",
      });
      await user.save();

      const res = await request(app)
        .post("/api/auth/verifyLoginOTP")
        .send({ otp: "000000" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid or expired OTP");
    });

    it("should login successfully with the correct OTP", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "loginUser",
        email: "login@example.com",
        password: "pass",
        isVerified: true,
        verificationToken: "111111",
      });
      await user.save();

      const res = await request(app)
        .post("/api/auth/verifyLoginOTP")
        .send({ otp: "111111" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");

      const updatedUser = await User.findOne({ username: "loginUser" });
      expect(updatedUser!.verificationToken).toBe("");
      const setCookieHeader = res.headers["set-cookie"];
      const cookies: string[] = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      expect(cookies.some(cookie => cookie.includes("authToken"))).toBe(true);
    });
    it("should return an error if password is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "someuser" }); // no password
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("User not found");
    });    
  });

  describe("POST /logout", () => {
    it("should log out successfully when token exists", async () => {
      const User = (await import("../models/User")).default;
      const user = new User({
        username: "logoutUser",
        email: "logout@example.com",
        password: "pass",
        isVerified: true,
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", [`authToken=${token}`])
        .send();
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out successfully");
    });

    it("should return an error if not logged in", async () => {
      const res = await request(app).post("/api/auth/logout").send();
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Not logged in");
    });
  });

  describe("POST /resendOTP", () => {
    it("should resend OTP for an authenticated user", async () => {
      // Using agent to persist session data
      const agent = request.agent(app);
      const registerRes = await agent.post("/api/auth/register").send({
        username: "resendUser",
        email: "resend@example.com",
        password: "pass",
      });
      expect(registerRes.status).toBe(201);

      const resendRes = await agent.post("/api/auth/resendOTP").send();
      expect(resendRes.status).toBe(200);
      expect(resendRes.body.message).toBe("OTP resent successfully");
    });

    it("should return an error if the user is not authenticated", async () => {
      const res = await request(app).post("/api/auth/resendOTP").send();
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("User not authenticated");
    });
  });
});