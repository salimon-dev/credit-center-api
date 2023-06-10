import { Request, Response } from "express";
import * as yup from "yup";
import { calculateFee, now } from "../utils";
import { TransactionModel } from "../models/transaction";
import { UserModel } from "../models/user";

const validationSchema = yup.object({
  to: yup.string().required(),
  amount: yup.number().required(),
});

export default async function send(req: Request, res: Response) {
  try {
    const { to, amount } = validationSchema.validateSync(req.body, {
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
      status: "exected",
      excutedAt: now(),
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
