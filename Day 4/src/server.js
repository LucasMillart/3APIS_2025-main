import express from "express";
import session from "express-session";

import authentificationRouter from "./routers/authentification-router.js";
import usersRouter from "./routers/users-router.js";

const app = express();

app.use(express.json());

// Configuration du middleware session
app.use(session({
  secret: "test",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use("/authentification", authentificationRouter);
app.use("/users", usersRouter);

export default app;