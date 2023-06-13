import { Request, Response } from "express";
import { UserModel } from "../models/user";
import * as yup from "yup";
import { calculateFee } from "../utils";
const validationSchema = yup.object({
  amount: yup.number().required().positive(),
});
export default async function getFee(req: Request, res: Response) {
  try {
    const { amount } = validationSchema.validateSync(req.query, {
      abortEarly: false,
    });
    res.send({
      ok: true,
      amount,
      fee: calculateFee(amount),
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
