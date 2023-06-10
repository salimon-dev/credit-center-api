import { Request, Response } from "express";
import * as yup from "yup";
import { TransactionModel } from "../models/transaction";
const validationSchema = yup.object({
  from: yup.string().optional(),
  to: yup.string().optional(),
  page: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(25),
});

export default async function transactions(req: Request, res: Response) {
  try {
    const { from, to, page, pageSize } = validationSchema.validateSync(
      req.query,
      { abortEarly: false }
    );
    const total = await TransactionModel.count({
      "from._id": from,
      "to._id": to,
    });
    const records = await TransactionModel.find({
      "from._id": from,
      "to._id": to,
    })
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
