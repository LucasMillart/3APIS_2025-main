import mongoose from "mongoose";
import { User } from "../mongo.js";

export function isAdmin(request, response, next)
{
  if (request.session.userRole !== "admin")
  {
    response.status(403).json({ error: "Non admin" });
    return;
  }
  next();
}

