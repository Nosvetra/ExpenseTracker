import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
env.config();

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "ungaBunga",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5000;
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.get("/expenses", async (req, res) => {
  if (req.isAuthenticated()) {
    const result = await db.query("SELECT * FROM ");
    res.json({ message: "user authenticated" });
  } else {
    res.json({ message: "not authenticated " });
  }
});

app.post("/expensis", async (req, res) => {
  console.log(req.body);
  if (req.isAuthenticated()) {
    try {
      const result = await db.query("SELECT * FROM ");
    } catch (err) {}
  } else {
    res.json({ message: "not authenticated " });
  }
});

app.post("/register", async (req, res) => {
  const UserName = req.body.username;
  const Password = req.body.password;
  console.log(req.body);
  try {
    const userExistCheck = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [UserName],
    );
    if (userExistCheck.rowCount > 0) {
      console.log("User Already exists");
      res.redirect("/login");
    } else {
      bcrypt.hash(Password, 10, async (err, hash) => {
        if (err) {
          console.log("error Generating hash");
        } else {
          const initiateQuery = await db.query(
            "INSERT INTO users(username, password) VALUES($1,$2) RETURNING *",
            [UserName, hash],
          );
          const user = initiateQuery.rows[0];
          req.logIn(user, (err) => {
            if (err) {
              console.log(err);
              return res.redirect("/login");
            }
            return res.redirect("/expenses"); // "/expenses" wehre i'll show the total expenses mth wise
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/expenses",
    failureRedirect: "/login",
  }),
);

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (result.rowCount > 0) {
        const user = result.rows[0];
        const storedHashPass = user.password;
        bcrypt.compare(username, storedHashPass, (err, result) => {
          if (err) {
            return cb(err);
          } else {
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      return cb(err);
    }
  }),
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
