import { Request, Response } from "express";
import axios from "axios";
import { ServiceModel } from "../../models/service";
import { IAuthRequest } from "../../middlewares/auth";
import { SessionModel } from "../../models/session";

export default async function getAuthToken(req: Request, res: Response) {
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
  if (!session) {
    res.status(400).send({
      ok: false,
      message: "you're not subscribed to this service",
    });
    return;
  }
  try {
    const { token, expiresAt } = await axios
      .post<{ ok: boolean; token: string; expiresAt: number }>(
        "/get-auth-token",
        { name: user.name },
        { baseURL: service.baseUrl, headers: { secret: service.secretToken } }
      )
      .then((response) => response.data);
    await session.deleteOne();
    res.send({
      ok: true,
      token,
      expiresAt,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ ok: false, message: "subscribing to service failed" });
  }
}
