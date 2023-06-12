import { Request, Response } from "express";
import * as yup from "yup";
import { TransactionModel } from "../models/transaction";
import { FilterQuery } from "mongoose";
import { IUser, UserModel } from "../models/user";
const validationSchema = yup.object({
  name: yup.string().optional(),
  page: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(25),
});

export default async function users(req: Request, res: Response) {
  try {
    const { name, page, pageSize } = validationSchema.validateSync(req.query, {
      abortEarly: false,
    });
    const query: FilterQuery<IUser> = {};
    if (name) {
      query.name = { $regex: name };
    }
    const total = await UserModel.count(query);
    const records = await UserModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.send({
      ok: true,
      data: records.map((item) => {
        return {
          _id: item._id,
          name: item.name,
          score: item.score,
          balance: item.balance,
          registeredAt: item.registeredAt,
        };
      }),
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
