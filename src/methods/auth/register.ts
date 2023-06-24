import { Request, Response } from "express";
import * as yup from "yup";
import { UserModel } from "../../models/user";
import { now } from "../../utils";
import { createHash } from "node:crypto";
import { v4 as uuidV4 } from "uuid";
const validationSchema = yup.object({
  name: yup
    .string()
    .required()
    .min(6)
    .max(32)
    .matches(/^[a-z0-9]+$/g, {
      message: "name only can containe lowercase chars and number",
    }),
});

export default async function register(req: Request, res: Response) {
  try {
    const { name } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const secretToken = uuidV4() + "-" + uuidV4();
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
      secretToken: createHash("md5").update(secretToken).digest("hex"),
      secretDate: now(),
      registeredAt: now(),
    });
    res.send({
      ok: true,
      user: {
        _id: user._id,
        name: user.name,
        score: user.score,
        balance: user.balance,
        secretToken,
        secretDate: user.secretDate,
        registeredAt: user.registeredAt,
      },
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
