import { Request, Response } from "express";
import { IAuthRequest } from "../../middlewares/auth";
import { generateJWT, now } from "../../utils";

export default async function profile(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;

  const accessToken = generateJWT(
    user._id.toString(),
    parseInt(process.env["TOKEN_AGE"] || "3600")
  );
  res.send({
    ok: true,
    user: user.toJSON(),
    accessToken,
    expiresAt: now() + parseInt(process.env["TOKEN_AGE"] || "3600"),
  });
}
