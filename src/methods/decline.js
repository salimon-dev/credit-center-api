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
export default function decline(req, res) {
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
        transaction.status = "declined";
        yield transaction.save();
        res.send({
            ok: true,
            message: "transaction executed",
        });
    });
}
