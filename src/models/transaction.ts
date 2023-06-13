import { Document, Schema, model } from "mongoose";

export interface ITransaction {
  _id: string;
  from: { name: string; _id: string };
  to: { name: string; _id: string };
  amount: number;
  fee: number;
  status: "pending" | "executed" | "declined";
  createdAt: number;
  executedAt?: number;
}

const Reference = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
});

const schema = new Schema<ITransaction>({
  from: { type: Reference, required: true },
  to: { type: Reference, required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Number, required: true },
  executedAt: { type: Number, required: false },
});

export const TransactionModel = model("transaction", schema);
export type TransactionDocument = Document & ITransaction;
