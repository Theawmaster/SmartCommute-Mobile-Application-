import mongoose, { Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string;
  isAdmin: Boolean;
  isPremium: Boolean;
  feedbacks: {
    message: string;
    rating: number;
    createdAt: Date;
  }[];
  comparePassword(password: string): Promise<boolean>;
}

const FeedbackSchema = new mongoose.Schema({
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: uuidv4 },
    isAdmin: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    feedbacks: [FeedbackSchema],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare hashed password for login
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;