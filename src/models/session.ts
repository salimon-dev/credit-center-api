import { Document, Schema, model } from "mongoose";
import { IReference, Reference } from "./common";

export interface ISession {
  _id: string;
  hostUser: IReference;
  targetUser: IReference;
  token: string;
  status: string;
  description: string;
  createdAt: number;
}

const schema = new Schema<ISession>({
  hostUser: { type: String, required: true },
  description: { type: String, required: true },
  token: { type: String, required: true },
  status: { type: String, required: true },
  targetUser: { type: Reference, required: true },
  createdAt: { type: Number, required: true },
});

export const SessionModel = model("session", schema);
export type SessionDocument = Document & ISession;
