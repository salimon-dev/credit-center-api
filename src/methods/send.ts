import { Request, Response } from "express";
import * as yup from "yup";
import { calculateFee, now } from "../utils";
import { TransactionModel } from "../models/transaction";
import { UserModel } from "../models/user";
import { IAuthRequest } from "../middlewares/auth";

const validationSchema = yup.object({
  to: yup.string().required(),
  amount: yup.number().required(),
});

export default async function send(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const { to, amount } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const fee = calculateFee(amount);

    const dstUser = await UserModel.findById(to);
    if (!dstUser) {
      res.status(400).send({
        ok: false,
        message: "transaction destination does not exists",
      });
      return;
    }
    if (user.balance < amount + fee) {
      res.status(400).send({ ok: false, message: "not enough credit" });
      return;
    }

    const transaction = await TransactionModel.create({
      from: { _id: user._id, name: user.name },
      to: { _id: dstUser._id, name: dstUser.name },
      amount,
      fee,
      status: "executed",
      executedAt: now(),
      createdAt: now(),
    });

    user.balance -= amount + fee;
    await user.save();

    dstUser.balance += amount + fee;
    await dstUser.save();

    res.send({ ok: true, transaction });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
