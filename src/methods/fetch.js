var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserModel } from "../models/user";
export default function fetch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.params;
        const user = yield UserModel.find({ name });
        if (!user) {
            res.status(404).send({ ok: false, message: "user not found" });
        }
        res.send({ ok: true, user });
    });
}
