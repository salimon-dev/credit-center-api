import { Router } from "express";
import decline from "./decline";
import auth from "../../middlewares/auth";
import execute from "./execute";
import transactions from "./transactions";
import send from "./send";
import getFee from "./getFee";
import demand from "./demand";

const routes = Router();

routes.post("/send", auth, send);
routes.post("/decline", auth, decline);
routes.post("/execute", auth, execute);
routes.post("/demand", auth, demand);

routes.get("/", auth, transactions);
routes.get("/getFee", getFee);

export default routes;
