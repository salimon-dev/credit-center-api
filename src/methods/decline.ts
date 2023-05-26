import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction";
import { UserModel } from "../models/user";

export default async function decline(req: Request, res: Response) {
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
  transaction.status = "declined";
  await transaction.save();

  res.send({
    ok: true,
    message: "transaction executed",
  });
}
