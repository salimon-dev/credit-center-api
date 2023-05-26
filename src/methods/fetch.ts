import { Request, Response } from "express";
import { UserModel } from "../models/user";

export default async function fetch(req: Request, res: Response) {
  const { name } = req.params as { name: string };
  const user = await UserModel.find({ name });
  if (!user) {
    res.status(404).send({ ok: false, message: "user not found" });
  }
  res.send({ ok: true, user });
}
