import { Request, Response } from "express";
import * as yup from "yup";
import { UserModel } from "../../models/user";
import { generateJWT, md5, now } from "../../utils";
const validationSchema = yup.object({
  name: yup
    .string()
    .required()
    .min(6)
    .max(32)
    .matches(/^[a-z0-9]+$/g, {
      message: "name only can containe lowercase chars and number",
    }),
  password: yup.string().required(),
});

export default async function register(req: Request, res: Response) {
  try {
    const { name, password } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    if ((await UserModel.findOne({ name })) !== null) {
      res.status(422).send({
        ok: false,
        errors: [
          {
            field: "name",
            message: "your account name must be unique",
          },
        ],
      });
      return;
    }
    const user = await UserModel.create({
      name,
      score: 0,
      balance: 0,
      password: md5(password),
      secretDate: now(),
      registeredAt: now(),
    });
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
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
