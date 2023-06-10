import { Request, Response } from "express";
import * as yup from "yup";
import { calculateFee, now } from "../utils";
import { TransactionModel } from "../models/transaction";
import { UserModel } from "../models/user";

const validationSchema = yup.object({
  from: yup.string().required(),
  amount: yup.number().required(),
});

export default async function demand(req: Request, res: Response) {
  try {
    const { from, amount } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const fee = calculateFee(amount);

    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).send({ ok: false, message: "unauthorized" });
      return;
    }
    const token = authorization.replace("Bearer ", "");
    const user = await UserModel.findOne({ secretToken: token });
    if (!user) {
      res.status(401).send({ ok: false, message: "unauthorized" });
      return;
    }

    const srcUser = await UserModel.findById(from);
    if (!srcUser) {
      res
        .status(400)
        .send({ ok: false, message: "transaction source does not exists" });
      return;
    }

    const transaction = await TransactionModel.create({
      from: { _id: srcUser._id, name: srcUser.name },
      to: { _id: user._id, name: user.name },
      amount,
      fee,
      status: "pending",
      createdAt: now(),
    });

    res.send({ ok: true, transaction });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
