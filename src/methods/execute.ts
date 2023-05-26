import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction";
import { UserModel } from "../models/user";

export default async function execute(req: Request, res: Response) {
  const { id } = req.params;
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
  const transaction = await TransactionModel.findById(id);
  if (!transaction) {
    res.status(404).send({ ok: false, message: "transaction not found" });
    return;
  }
  if (transaction.from !== user.name) {
    res.status(403).send({ ok: false, message: "permission denied" });
    return;
  }
  const dstUser = await UserModel.findOne({ name: transaction.to });
  if (!dstUser) {
    res.status(400).send({ ok: false, message: "transaction destination does not exists" });
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
  transaction.status = "excuted";
  await transaction.save();

  res.send({
    ok: true,
    message: "transaction executed",
  });
}
