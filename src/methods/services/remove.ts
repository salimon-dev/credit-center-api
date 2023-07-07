import { Request, Response } from "express";
import * as yup from "yup";
import { now } from "../../utils";
import { IAuthRequest } from "../../middlewares/auth";
import { ServiceModel } from "../../models/service";
import { SessionModel } from "../../models/session";

export default async function remove(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  try {
    const { id } = req.params as { id: string };
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

    await service.deleteOne();
    await SessionModel.deleteMany({ "service._id": id });

    res.send({ ok: true, message: "service removed." });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send({ ok: false, errors });
  }
}
