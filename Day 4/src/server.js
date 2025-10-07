import express from "express";

import authentificationRouter from "./routers/authentification-router.js";
import inscriptionRouter from "./routers/inscription-router.js";

const app = express();

app.use(express.json());

app.use("/login", authentificationRouter);
app.use("/inscription", inscriptionRouter);

export default app;