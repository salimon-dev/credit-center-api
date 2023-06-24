import { Router } from "express";
import login from "./login";
import register from "./register";
import profile from "./profile";
import auth from "../../middlewares/auth";
const routes = Router();

routes.post("/login", login);
routes.post("/register", register);
routes.get("/profile", auth, profile);

export default routes;
