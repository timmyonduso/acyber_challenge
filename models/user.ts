import { ObjectId } from "mongodb";

// 👤 User (Influencer/Brand) Model
export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  role: "influencer" | "brand";
  createdAt: Date;
  updatedAt: Date;
}