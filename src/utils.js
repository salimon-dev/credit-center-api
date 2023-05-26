var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
export function now() {
    return Math.floor(Date.now() / 1000);
}
export function calculateFee(amount) {
    return amount * 0.01;
}
export function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect(process.env.MONGO_URI || "none");
        console.log("connected to mongoose");
    });
}
