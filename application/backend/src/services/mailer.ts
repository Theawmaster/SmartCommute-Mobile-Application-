import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create a nodemailer transporter
// Option 1: Using SMTP Relay (recommended)
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // will use "smtp.gmail.com"
    port: Number(process.env.SMTP_PORT), // will use 587 (or 465 if changed in .env)
    secure: Number(process.env.SMTP_PORT) === 465, // secure true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});

// Function to send Login OTP email
export const sendLoginOTPEmail = async (user: any, otp: string) => {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: "Your OTP for Login",
      text: `Hello ${user.username},\n\nYour OTP for login is: ${otp}\n\nPlease enter this OTP to complete your login.`,
    };
  
    try {
      transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending OTP email:", error);
    }
};