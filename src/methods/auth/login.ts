import { Request, Response } from "express";
import * as yup from "yup";
import { UserModel } from "../../models/user";
import { createHash } from "node:crypto";
const validationSchema = yup.object({
  name: yup.string().required(),
  secretToken: yup.string().required(),
});

export default async function login(req: Request, res: Response) {
  try {
    const { name, secretToken } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const user = await UserModel.findOne({
      name,
      secretToken: createHash("md5").update(secretToken).digest("hex"),
    });
    if (!user) {
      res.status(401).send({ ok: false, message: "unauthorized" });
      return;
    }
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
    console.log(e);
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
