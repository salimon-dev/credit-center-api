var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TransactionModel } from "../models/transaction";
import { UserModel } from "../models/user";
export default function execute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
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
        const transaction = yield TransactionModel.findById(id);
        if (!transaction) {
            res.status(404).send({ ok: false, message: "transaction not found" });
            return;
        }
        if (transaction.from !== user.name) {
            res.status(403).send({ ok: false, message: "permission denied" });
            return;
        }
        const dstUser = yield UserModel.findOne({ name: transaction.to });
        if (!dstUser) {
            res.status(400).send({ ok: false, message: "transaction destination does not exists" });
            return;
        }
        if (user.balance < transaction.amount + transaction.fee) {
            res.status(400).send({ ok: false, message: "not enough credit" });
            return;
        }
        // exchange balance
        user.balance -= transaction.amount + transaction.fee;
        yield user.save();
        dstUser.balance += transaction.amount;
        yield dstUser.save();
        transaction.status = "excuted";
        yield transaction.save();
        res.send({
            ok: true,
            message: "transaction executed",
        });
    });
}
