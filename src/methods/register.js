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
import { UserModel } from "../models/user";
import { now } from "../utils";
const validationSchema = yup.object({
    name: yup.string().required().min(6).max(32),
});
export default function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = validationSchema.validateSync(req.body, { abortEarly: false });
            const user = yield UserModel.create({ name, score: 0, balance: 0, registerdAt: now() });
            res.send({ ok: true, user });
        }
        catch (e) {
            const { errors } = e;
            res.status(422).send({ ok: false, errors });
        }
    });
}
