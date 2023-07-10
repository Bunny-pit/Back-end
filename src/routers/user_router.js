import express from "express";
import UserController from '../controllers/User_controller.js'

const app = express();
const user_router = express.Router();

app.post("/register", UserController.createUser);

app.patch("/edit", UserController.updateUser);

// app.delete("/delete", UserController.deleteUser);

export default user_router;