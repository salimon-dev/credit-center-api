import { Request, Response } from "express";
import * as yup from "yup";
import { now } from "../../utils";
import { IAuthRequest } from "../../middlewares/auth";
import { ServiceModel } from "../../models/service";

const validationSchema = yup.object({
  title: yup.string().optional(),
  description: yup.string().optional(),
  homePage: yup.string().optional(),
  terms: yup.string().optional(),
  baseUrl: yup.string().optional(),
  type: yup.string().optional(),
  secretToken: yup.string().optional(),
});

export default async function edit(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const { id } = req.params as { id: string };
    const body = validationSchema.validateSync(req.body, {
      abortEarly: false,
    });
    const service = await ServiceModel.findById(id);
    if (!service) {
      res.status(404).send({ ok: false, message: "service not found" });
      return;
    }
    if (service.user._id !== user._id.toString()) {
      res.status(403).send({
        ok: false,
        message: "permission denied to alter service details",
      });
      return;
    }

    service.set({
      ...body,
      updatedAt: now(),
    });
    await service.save();

    res.send({ ok: true, service });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
