import { Request, Response } from "express";
import axios from "axios";
import { ServiceModel } from "../../models/service";
import { IAuthRequest } from "../../middlewares/auth";
import { SessionModel } from "../../models/session";
import { now } from "../../utils";

export default async function subscribe(req: Request, res: Response) {
  const user = (req as IAuthRequest).user;
  const { serviceId } = req.params as { serviceId: string };
  const service = await ServiceModel.findById(serviceId);
  if (!service) {
    res.status(404).send({ ok: false, message: "service not found" });
    return;
  }
  const session = await SessionModel.findOne({
    "user._id": user._id.toString(),
    "service._id": service._id.toString(),
  });
  if (session) {
    res.status(400).send({
      ok: false,
      message: "you are already been subscribed to this service",
    });
    return;
  }
  try {
    await axios.post(
      "/subscribe",
      { name: user.name },
      { baseURL: service.baseUrl, headers: { secret: service.secretToken } }
    );
    const session = await SessionModel.create({
      service: { _id: service._id.toString(), name: service.title },
      user: { _id: user._id.toString(), name: user.name },
      status: "active",
      createdAt: now(),
      updatedAt: now(),
    });
    res.send({
      ok: true,
      session,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ ok: false, message: "subscribing to service failed" });
  }
}
