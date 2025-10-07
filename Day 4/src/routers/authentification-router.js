import express from "express";
import bcrypt from "bcrypt";

import { User } from "../mongo.js";

const router = express.Router();

router.get("/", async (request, response) =>
{
  try
  {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email });
    if (!user)
    {
      response.status(403).json({ message: "Pas de compte trouvé" })
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
    {
      response.status(401).json({ message: 'Mot de passe incorrect' });
      return;
    }
    response.status(200).json(user);
  } catch (error)
  {
    console.error("Erreur lors de l'execution", error);
    response.status(500).json({ message: 'Erreur serveur pendant l\'authentification.' });
  }

});



export default router;