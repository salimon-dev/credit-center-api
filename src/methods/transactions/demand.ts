import { Request, Response } from "express";
import * as yup from "yup";
import { calculateFee, now } from "../../utils";
import { TransactionModel } from "../../models/transaction";
import { UserModel } from "../../models/user";
import { IAuthRequest } from "../../middlewares/auth";

const validationSchema = yup.object({
  name: yup.string().required(),
  amount: yup.number().required(),
});

export default async function demand(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const { name, amount } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const fee = calculateFee(amount);

    const srcUser = await UserModel.findOne({ name });
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
