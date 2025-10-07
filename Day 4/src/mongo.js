import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const DBNAME = "trainstation";

mongoose.connect(MONGODB_URI, {
  dbName: DBNAME,
});

mongoose.connection.on("error", (e) =>
{
  console.log("Erreur", e.toString());
});

mongoose.connection.on("connected", () =>
{
  console.log("Connection à MongoDB établi !");
});

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  role: { type: String, default: 'user' }
});

export const User = mongoose.model("User", UserSchema);