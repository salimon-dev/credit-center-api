import mongoose from "mongoose";

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
