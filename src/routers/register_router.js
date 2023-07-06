import express from "express";
import User from '../models/User.js'

const app = express();
const register_router = express.Router();

app.post("/", async (req, res) => {
  const user = await new User(req.body)
  user.save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        success: false,
        err: err,
      });
    });
});

export default register_router;