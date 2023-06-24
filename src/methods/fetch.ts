import { Request, Response } from "express";
import { UserModel } from "../models/user";
import * as yup from "yup";
const validationSchema = yup.object({
  name: yup.string().required(),
});
export default async function fetch(req: Request, res: Response) {
  try {
    const { name } = validationSchema.validateSync(req.query, {
      abortEarly: false,
    });
    const user = await UserModel.findOne({ name });
    if (!user) {
      res.status(404).send({ ok: false, message: "user not found" });
      return;
    }
    res.send({
      ok: true,
      user: {
        _id: user._id,
        name: user.name,
        score: user.score,
        registeredAt: user.registeredAt,
      },
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
