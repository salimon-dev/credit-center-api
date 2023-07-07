import { NextFunction, Request, Response } from "express";
import { UserDocument, UserModel } from "../models/user";
import { verifyJWT } from "../utils";

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
  const id = verifyJWT(token);
  const user = await UserModel.findById(id);
  if (!user) {
    res.status(401).send({ ok: false, message: "unauthorized" });
    return;
  }
  (req as IAuthRequest).user = user;
  next();
}
