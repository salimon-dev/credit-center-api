import { Document, Schema, model } from "mongoose";
import { IReference, Reference } from "./common";

export interface ISession {
  _id: string;
  service: IReference;
  user: IReference;
  status: string;
  createdAt: number;
  updatedAt: number;
}

const schema = new Schema<ISession>({
  service: { type: Reference, required: true },
  user: { type: Reference, required: true },
  status: { type: String, required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

export const SessionModel = model("session", schema);
export type SessionDocument = Document & ISession;
