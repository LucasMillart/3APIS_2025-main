import express from "express";
import bcrypt from "bcrypt";

import { User } from "../mongo.js";

const router = express.Router();


router.post("/login", (request, response) =>
{
  User.findOne({ email: request.body.email })
    .then(user =>
    {
      if (!user) response.status(404).json({ error: "Pas d'utilisateur avec cet email" })
      else
      {
        bcrypt.compare(request.body.password, user.password, (error, match) =>
        {
          if (error) response.status(500).json(error);
          else if (match)
          {
            request.session.username = user.username;
            request.session.userEmail = user.email;
            request.session.userRole = user.role;
            request.session.userID = user._id;
            response.status(200).json({ message: `Salut ${request.session.username}, tu as été connecté avec succès !` })
          }
          else response.status(403).json({ error: "Le mot de passe est incorrect !" });
        })
      }
    }
    )
    .catch(error =>
    {
      response.status(500).json(error)
    })
});


/*router.get("/login", async (request, response) =>
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
    request.session.username = user.username;
    request.session.userEmail = user.email;
    request.session.userRole = user.role;
    request.session.userID = user._id;
    response.status(200).json({ message: `Bonjour ${user.username} tu es connecté avec succès.` });
  } catch (error)
  {
    console.error("Erreur lors de l'execution", error);
    response.status(500).json({ message: 'Erreur serveur pendant l\'authentification.' });
  }

});*/

router.post('/inscription', async (request, response) =>
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