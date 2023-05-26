import express from "express";
import dotenv from "dotenv";

import specs from "./methods/specs";
import transaction from "./methods/transactions";
import demand from "./methods/demand";
import send from "./methods/send";
import execute from "./methods/execute";
import decline from "./methods/decline";
import fetch from "./methods/fetch";
import register from "./methods/register";
import { connectToDB } from "./utils";

dotenv.config();
const port = process.env.PORT;
const app = express();

app.get("/", specs);

app.post("/register", register);
app.get("/fetch/name", fetch);

app.get("/transactions", transaction);
app.post("/demand", demand);
app.post("/send", send);
app.post("/execute", execute);
app.post("/decline", decline);

app.listen(port, () => {
  console.log("started credit center on port", port);
  connectToDB();
});
