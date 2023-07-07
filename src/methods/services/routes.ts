import { Router } from "express";
import auth from "../../middlewares/auth";
import create from "./create";
import edit from "./edit";
import remove from "./remove";
import get from "./get";
import search from "./search";

const routes = Router();

routes.post("/", auth, create);
routes.post("/:id", auth, edit);
routes.delete("/:id", auth, remove);
routes.get("/:id", auth, get);

routes.get("/", auth, search);

export default routes;
