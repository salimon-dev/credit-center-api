import { Request, Response } from "express";
import * as yup from "yup";
import { UserModel } from "../models/user";
import { now } from "../utils";
const validationSchema = yup.object({
  name: yup.string().required().min(6).max(32),
});

export default async function register(req: Request, res: Response) {
  try {
    const { name } = validationSchema.validateSync(req.body, { abortEarly: false });
    const user = await UserModel.create({ name, score: 0, balance: 0, registeredAt: now() });
    res.send({ ok: true, user });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
