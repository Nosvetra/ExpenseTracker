import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import moduleName from "axios";
import env from "dotenv";

const app = express();
const port = process.env.PORT || 5000;
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.post("/register", (req, res) => {
  const UserName = req.body.username;
  const Password = req.body.Password;
});
