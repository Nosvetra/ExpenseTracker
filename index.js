import express from "express";
import bodyParser from "body-parser";
import moduleName from "axios";
import env from "dotenv";

const app = express();
const port = process.env.PORT || 5000;

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
