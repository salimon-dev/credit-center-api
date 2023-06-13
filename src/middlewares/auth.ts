import { NextFunction, Request, Response } from "express";
import { createHash } from "node:crypto";
import { UserDocument, UserModel } from "../models/user";

export interface IAuthRequest extends Request {
  user: UserDocument;
}
export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({ ok: false, message: "unauthorized" });
    return;
  }
  const token = authorization.replace("Bearer ", "");
  const user = await UserModel.findOne({
    secretToken: createHash("md5").update(token).digest("hex"),
  });
  if (!user) {
    res.status(401).send({ ok: false, message: "unauthorized" });
    return;
  }
  (req as IAuthRequest).user = user;
  next();
}
