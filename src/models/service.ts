import { Document, Schema, model } from "mongoose";
import { IReference, Reference } from "./common";

export interface IService {
  _id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  description: string;
  homePage?: string;
  terms?: string;
  baseUrl: string;
  user: IReference;
  type: string;
  secretToken?: string;
}

const schema = new Schema<IService>({
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  homePage: { type: String, required: false },
  terms: { type: String, required: false },
  baseUrl: { type: String, required: true },
  user: { type: Reference, required: true },
  type: { type: String, required: true },
  secretToken: { type: String, required: false },
});

export const ServiceModel = model("service", schema);
export type ServiceDocument = Document & IService;
