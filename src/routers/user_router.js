import express from 'express';
import UserController from '../controllers/User_controller.js';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('유저 루트 페이지');
});

userRouter.post('/register', UserController.createUser);
userRouter.get('/register', UserController.getUser);

userRouter.post('/login', UserController.loginUser);
userRouter.post('/logout', UserController.logout);

userRouter.patch('/edit', UserController.updateUser);
userRouter.delete('/delete', UserController.deleteUser);

userRouter.patch('/edit', UserController.updateUser);
userRouter.delete('/delete', UserController.deleteUser);

userRouter.get('/accessToken', UserController.accessToken);
// userRouter.get("/refreshToken", UserController.refreshToken);
// userRouter.get("/loginsuccess", UserController.loginSuccess);
//관리자 기능
userRouter.get('/register', UserController.getUser);

export default userRouter;
