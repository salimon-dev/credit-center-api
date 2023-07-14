import { Request, Response } from "express";
import * as yup from "yup";
import { SessionModel } from "../../models/session";
const validationSchema = yup.object({
  page: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(25),
});

export default async function search(req: Request, res: Response) {
  try {
    const { page, pageSize } = validationSchema.validateSync(req.query, {
      abortEarly: false,
    });

    const total = await SessionModel.count({});
    const records = await SessionModel.find({})
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
