import express from "express";
import UserController from '../controllers/User_controller.js'
import passport from 'passport';

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send('유저 루트 페이지');
})
userRouter.post("/register", UserController.createUser);

userRouter.patch("/edit", UserController.updateUser);

// app.delete("/delete", UserController.deleteUser);

export default userRouter;