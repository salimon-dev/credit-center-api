import { Request, Response } from "express";
import { TransactionModel } from "../../models/transaction";
import { UserModel } from "../../models/user";
import * as yup from "yup";
import { IAuthRequest } from "../../middlewares/auth";
import { now } from "../../utils";

const validationSchema = yup.object({
  id: yup.string().required(),
});
export default async function execute(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const { id } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const transaction = await TransactionModel.findById(id);
    if (!transaction) {
      res.status(404).send({ ok: false, message: "transaction not found" });
      return;
    }
    if (transaction.from._id !== user._id.toString()) {
      res.status(403).send({ ok: false, message: "permission denied" });
      return;
    }
    const dstUser = await UserModel.findById(transaction.to._id);
    if (!dstUser) {
      res.status(400).send({
        ok: false,
        message: "transaction destination does not exists",
      });
      return;
    }
    if (user.balance < transaction.amount + transaction.fee) {
      res.status(400).send({ ok: false, message: "not enough credit" });
      return;
    }
    // exchange balance
    user.balance -= transaction.amount + transaction.fee;
    await user.save();
    dstUser.balance += transaction.amount;
    await dstUser.save();
    transaction.status = "executed";
    transaction.executedAt = now();
    await transaction.save();

    res.send({
      ok: true,
      message: "transaction executed",
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
