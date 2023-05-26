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
import { calculateFee, now } from "../utils";
import { TransactionModel } from "../models/transaction";
import { UserModel } from "../models/user";
const validationSchema = yup.object({
    from: yup.string().required(),
    to: yup.string().required(),
    amount: yup.number().required(),
});
export default function send(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { from, to, amount } = validationSchema.validateSync(req.body, { abortEarly: false });
            const fee = calculateFee(amount);
            const { authorization } = req.headers;
            if (!authorization) {
                res.status(401).send({ ok: false, message: "unauthorized" });
                return;
            }
            const token = authorization.replace("Bearer ", "");
            const user = yield UserModel.findOne({ secretToken: token });
            if (!user) {
                res.status(401).send({ ok: false, message: "unauthorized" });
                return;
            }
            if (user.name !== from) {
                res.status(403).send({ ok: false, message: "permission denied" });
                return;
            }
            const dstUser = yield UserModel.findOne({ name: to });
            if (!dstUser) {
                res.status(400).send({ ok: false, message: "transaction destination does not exists" });
                return;
            }
            if (user.balance < amount + fee) {
                res.status(400).send({ ok: false, message: "not enough credit" });
                return;
            }
            const transaction = yield TransactionModel.create({ from, to, amount, fee, status: "exected", excutedAt: now(), createdAt: now() });
            user.balance -= amount + fee;
            yield user.save();
            dstUser.balance += amount + fee;
            yield dstUser.save();
            res.send({ ok: true, transaction });
        }
        catch (e) {
            const { errors } = e;
            res.status(422).send({ ok: false, errors });
        }
    });
}
