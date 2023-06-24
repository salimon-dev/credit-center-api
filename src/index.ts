import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import specs from "./methods/specs";
import transactions from "./methods/transactions/routes";
import auth from "./methods/auth/routes";
import { connectToDB } from "./utils";
import fetch from "./methods/fetch";

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", specs);
app.use("/transactions", transactions);
app.use("/auth", auth);
app.use("/fetch", fetch);

app.listen(port, () => {
  console.log("started credit center on port", port);
  connectToDB();
});
