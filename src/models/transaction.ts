import { Document, Schema, model } from "mongoose";

export interface ITransaction {
  _id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  status: "pending" | "excuted" | "declined";
  createdAt: number;
  executedAt?: number;
}

const schema = new Schema<ITransaction>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Number, required: true },
  executedAt: { type: Number, required: false },
});

export const TransactionModel = model("transaction", schema);
export type TransactionDocument = Document & ITransaction;
