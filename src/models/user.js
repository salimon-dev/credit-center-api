import { Schema, model } from "mongoose";
const schema = new Schema({
    name: { type: String, required: true },
    registerdAt: { type: Number, required: true },
});
export const UserModel = model("user", schema);
