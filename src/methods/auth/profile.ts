import { Request, Response } from "express";
import { IAuthRequest } from "../../middlewares/auth";

export default async function profile(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  res.send({
    ok: true,
    user: user.toJSON(),
  });
}
