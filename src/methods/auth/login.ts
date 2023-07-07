import { Request, Response } from "express";
import * as yup from "yup";
import { UserModel } from "../../models/user";
import { createHash } from "node:crypto";
import { generateJWT, md5, now } from "../../utils";
const validationSchema = yup.object({
  name: yup.string().required(),
  password: yup.string().required(),
});

export default async function login(req: Request, res: Response) {
  try {
    const { name, password } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const user = await UserModel.findOne({
      name,
      password: md5(password),
    });
    if (!user) {
      res.status(401).send({ ok: false, message: "unauthorized" });
      return;
    }

    const accessToken = generateJWT(
      user._id.toString(),
      parseInt(process.env["TOKEN_AGE"] || "3600")
    );
    res.send({
      ok: true,
      user: {
        _id: user._id,
        name: user.name,
        score: user.score,
        balance: user.balance,
        secretDate: user.secretDate,
        registeredAt: user.registeredAt,
      },
      accessToken,
      expiresAt: now() + parseInt(process.env["TOKEN_AGE"] || "3600"),
    });
  } catch (e) {
    console.log(e);
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
