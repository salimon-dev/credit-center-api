var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as yup from "yup";
import { TransactionModel } from "../models/transaction";
const validationSchema = yup.object({
    from: yup.string().optional(),
    to: yup.string().optional(),
    page: yup.number().optional().default(1),
    pageSize: yup.number().optional().default(25),
});
export default function transactions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { from, to, page, pageSize } = validationSchema.validateSync(req.query, { abortEarly: false });
            const total = yield TransactionModel.count({ from, to });
            const records = yield TransactionModel.find({ from, to })
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
        }
        catch (e) {
            const { errors } = e;
            res.status(422).send({ ok: false, errors });
        }
    });
}
