import { Request, Response } from "express";
import * as yup from "yup";
import { IAuthRequest } from "../../middlewares/auth";
import { SessionModel } from "../../models/session";

const validationSchema = yup.object({
  sessionId: yup.string().required(),
  token: yup.string().required(),
});
export default async function verify(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const { sessionId, token } = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const session = await SessionModel.findOne({
      _id: sessionId,
      token,
      status: "pending",
    });
    if (!session) {
      res.status(400).send({ ok: false, message: "session not found" });
      return;
    }
    session.status = "activated";
    await session.save();
    res.send({
      ok: true,
      session: {
        _id: session._id,
        hostUser: session.hostUser,
        targetUser: session.targetUser,
        status: session.status,
        description: session.description,
        createdAt: session.createdAt,
      },
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
