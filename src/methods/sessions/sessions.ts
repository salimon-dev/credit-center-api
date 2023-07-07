import { Request, Response } from "express";
import * as yup from "yup";
import { FilterQuery } from "mongoose";
import { IAuthRequest } from "../../middlewares/auth";
import { ISession, SessionModel } from "../../models/session";
const validationSchema = yup.object({
  status: yup.string().optional(),
  host: yup.string().optional(),
  target: yup.string().optional(),
  page: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(25),
});

export default async function sessions(req: Request, res: Response) {
  const { user } = req as IAuthRequest;
  try {
    const { status, host, target, page, pageSize } =
      validationSchema.validateSync(req.query, { abortEarly: false });
    const query: FilterQuery<ISession> = {
      $or: [{ "hostUser._id": user._id }, { "targetUser._id": user._id }],
    };
    if (status) {
      query.status = status;
    }
    // TODO get actual user ids by name
    if (host) {
      query["hostUser.name"] = host;
    }
    if (target) {
      query["targetUser.name"] = target;
    }

    const total = await SessionModel.count(query);
    const records = await SessionModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.send({
      ok: true,
      data: records,
      meta: {
        total,
        page,
        pageSize,
      },
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
