import { Schema } from "mongoose";

export interface IReference {
  _id: string;
  name: string;
}
export const Reference = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
});
