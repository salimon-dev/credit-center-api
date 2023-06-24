import { Document, Schema, model } from "mongoose";
import { IReference, Reference } from "./common";

export interface ISession {
  _id: string;
  user: IReference;
  token: string;
  name: string;
  createdAt: number;
}

const schema = new Schema<ISession>({
  name: { type: String, required: true },
  token: { type: String, required: true },
  user: { type: Reference, required: true },
  createdAt: { type: Number, required: true },
});

export const SessionModel = model("session", schema);
export type SessionDocument = Document & ISession;
