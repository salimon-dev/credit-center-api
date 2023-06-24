import { Request, Response } from "express";
import * as yup from "yup";
import { ITransaction, TransactionModel } from "../../models/transaction";
import { FilterQuery } from "mongoose";
import { IAuthRequest } from "../../middlewares/auth";
const validationSchema = yup.object({
  from: yup.string().optional(),
  to: yup.string().optional(),
  address: yup.string().optional(),
  page: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(25),
});

export default async function transactions(req: Request, res: Response) {
  const { user } = req as IAuthRequest;
  try {
    const { from, to, page, pageSize } = validationSchema.validateSync(
      req.query,
      { abortEarly: false }
    );
    const query: FilterQuery<ITransaction> = {
      $or: [{ "from._id": user._id }, { "to._id": user._id }],
    };

    if (from) {
      query["from._id"] = from;
    }
    if (to) {
      query["to._id"] = to;
    }

    const total = await TransactionModel.count(query);
    const records = await TransactionModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.send({
      ok: true,
      data: records.map((item) => {
        return {
          _id: item._id,
          from: item.from,
          to: item.to,
          amount: item.amount,
          fee: item.fee,
          status: item.status,
          createdAt: item.createdAt,
          executedAt: item.executedAt,
          details: "https://credit.salimon.io/transaction/" + item._id,
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
