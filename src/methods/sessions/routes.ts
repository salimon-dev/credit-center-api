import { Router } from "express";
import create from "./create";
import auth from "../../middlewares/auth";
import sessions from "./sessions";
import verify from "./verify";
import search from "./search";

const routes = Router();

routes.get("/", auth, search);
routes.post("/create", auth, create);
routes.get("/search", auth, sessions);
routes.post("/verify", auth, verify);

export default routes;
