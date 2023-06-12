import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import specs from "./methods/specs";
import transaction from "./methods/transactions";
import demand from "./methods/demand";
import send from "./methods/send";
import execute from "./methods/execute";
import decline from "./methods/decline";
import fetch from "./methods/fetch";
import register from "./methods/register";
import { connectToDB } from "./utils";
import users from "./methods/users";
import login from "./methods/login";

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", specs);

app.post("/register", register);
app.post("/login", login);
app.get("/fetch", fetch);

app.get("/transactions", transaction);
app.get("/users", users);
app.post("/demand", demand);
app.post("/send", send);
app.post("/execute", execute);
app.post("/decline", decline);

app.listen(port, () => {
  console.log("started credit center on port", port);
  connectToDB();
});
