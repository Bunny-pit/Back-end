import express from "express";
import UserController from '../controllers/User_controller.js'
import { adminCheck, loginRequired } from "../middlewares/index.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send('유저 루트 페이지');
})

//유저 기능
userRouter.post("/register", UserController.createUser);

userRouter.post("/login", loginRequired, UserController.loginUser);
userRouter.post("/logout", loginRequired, UserController.logout);

userRouter.patch("/edit", loginRequired, UserController.updateUser);
userRouter.delete("/delete", UserController.deleteUser);

userRouter.get("/accessToken", UserController.loginSuccess);
userRouter.get("/refreshToken", UserController.refreshToken);

//관리자 기능
userRouter.get("/register", UserController.getUser)



export default userRouter;