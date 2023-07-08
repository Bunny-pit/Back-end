import express from "express";
import UserService from '../services/user_service.js'

const app = express();
const user_router = express.Router();

app.post("/register", UserService.createUser);

app.patch("/edit", UserService.updateUser);

app.delete("/delete", UserService.deleteUser);

export default user_router;