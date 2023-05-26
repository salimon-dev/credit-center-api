import { Schema, model } from "mongoose";
const schema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Number, required: true },
    executedAt: { type: Number, required: false },
});
export const TransactionModel = model("transaction", schema);
