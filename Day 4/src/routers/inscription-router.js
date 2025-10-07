import express from "express";
import bcrypt from "bcrypt";

import { User } from "../mongo.js";

const router = express.Router();

router.post('/', async (request, response) =>
{

  const { email, password } = request.body;
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);
  const existingUser = await User.findOne({ email })
  if (existingUser)
  {
    return response.status(409).json({ message: "Cette email est déjà utilisé !" })
  }

  const newUser = User({ ...request.body, password: hashPassword });
  newUser.save()
    .then(
      user =>
      {
        response.status(200).json({ message: `Bienvenue ${user.username}, ton compte a été créé avec succès. Tu peux te connecter !`, id: newUser._id })
      }
    ).catch(error =>
    {
      console.log("Erreur lors de la création de compte");
      response.status(500).message({ message: "Erreur lors de la création de compte" });
    });
});

export default router;