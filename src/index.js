import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

// data base tables creation
import db from "./db/index.js";
import models from "./models/index.js";
await models(db);

const port = process.env.PORT || 3000;

// app routes

import { app } from "./app.js";
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
