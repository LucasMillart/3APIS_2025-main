import express from "express";
import bcrypt from "bcrypt";

import { User } from "../mongo.js";

const router = express.Router();

router.get("/", async (request, response) =>
{
  const users = await User.find();
  response.status(200).json(users);
});

router.get("/:id", async (request, response) =>
{
  const user = await User.findOne({ email: request.body.email })
  response.status(200).json(user);
});

router.put("/:id", async (request, response) =>
{
  try
  {
    const { email, password, newPassword, ...others } = request.body;
    const user = await User.findOne({ email });
    //user existant avec le mail ?
    if (!user)
    {
      return response.status(404).json({ error: "Pas d'utilisateur avec cet email" });
    }
    // Mot de passe correct ?
    const match = await bcrypt.compare(request.body.password, user.password);
    if (!match)
    {
      return response.status(403).json({ message: "Le mot de passe est incorrect !" });
    }

    //nouvelle données
    const updateData = { ...others };
    if (newPassword)
    {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const newUser = await User.findByIdAndUpdate(request.params.id, updateData);

    response.status(200).json({ message: "Utilisateur mis à jour", user: newUser });
    return;
  } catch (error)
  {
    console.log(error)
    response.status(409).json({
      message: `Problème lors de la modification user`
    });
  }
});

router.delete("/:id", async (request, response) =>
{
  try
  {
    const user = await User.findById(request.params.id);
    if (!user) { return response.status(404).json({ error: "Pas d'utilisateur avec cet email" }); }
    const match = await bcrypt.compare(request.body.password, user.password);
    if (!match)
    {
      return response.status(403).json({ message: "Le mot de passe est incorrect !" });
    }
    const deletedUser = await User.findByIdAndDelete(request.params.id);

    response.status(200).json({ message: "Utilisateur delete", user: deletedUser })
  } catch (error)
  {
    console.log(error);
  }
})

export default router;