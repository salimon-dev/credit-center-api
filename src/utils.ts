import mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import { createHash } from "crypto";

export function now() {
  return Math.floor(Date.now() / 1000);
}

export function calculateFee(amount: number) {
  return Math.ceil(amount * 0.01);
}

export async function connectToDB() {
  await mongoose.connect(process.env.MONGO_URI || "none");
  console.log("connected to mongoose");
}

export function md5(value: string) {
  return createHash("md5").update(value).digest("hex");
}

export function generateJWT(data: string, age: number) {
  return jwt.sign(
    {
      data,
    },
    process.env["SECRET_STRING"] || "somesecret",
    { expiresIn: age }
  );
}

export function verifyJWT(token: string) {
  try {
    const result = jwt.verify(
      token,
      process.env["SECRET_STRING"] || "somesecret"
    ) as { data: string };
    return result.data;
  } catch {
    return null;
  }
}
