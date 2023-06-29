import { Request, Response } from "express";
import { now } from "../../utils";
import * as yup from "yup";
import { IAuthRequest } from "../../middlewares/auth";
import { UserModel } from "../../models/user";
import { SessionModel } from "../../models/session";

const validationSchema = yup.object({
  target: yup.string().required(),
  description: yup.string().required(),
});
export default async function create(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const { target, description } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const targetUser = await UserModel.findOne({ name: target });
    if (!targetUser) {
      res.status(404).send({
        ok: false,
        message: "target user not found",
      });
      return;
    }
    const session = await SessionModel.create({
      hostUser: {
        _id: user._id,
        name: user.name,
      },
      targetUser: {
        _id: targetUser._id,
        name: targetUser.name,
      },
      status: "pending",
      token: Math.random() * 8999999 + 1000000,
      description,
      createdAt: now(),
    });
    res.send({
      ok: true,
      message: "session created",
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
