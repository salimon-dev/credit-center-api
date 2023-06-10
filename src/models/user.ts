import { Document, Schema, model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  score: number;
  balance: number;
  registeredAt: number;
  secretToken: string;
}

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  registeredAt: { type: Number, required: true },
});

export const UserModel = model("user", schema);
export type UserDocument = Document & IUser;
