import { Request, Response } from "express";
import * as yup from "yup";
import { now } from "../../utils";
import { IAuthRequest } from "../../middlewares/auth";
import { ServiceModel } from "../../models/service";

const validationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  homePage: yup.string().optional(),
  terms: yup.string().optional(),
  baseUrl: yup.string().required(),
  type: yup.string().required(),
  secretToken: yup.string().required(),
});

export default async function create(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const body = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });

    const service = await ServiceModel.create({
      ...body,
      user: { _id: user._id, name: user.name },
      createdAt: now(),
      updatedAt: now(),
    });
    res.send({ ok: true, service });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
