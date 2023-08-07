import express from 'express';
import UserController from '../controllers/user_controller.js';
import loginRequired from '../middlewares/login_required.js';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('유저 루트 페이지 입니다.');
});

userRouter.post('/register', UserController.createUser);
userRouter.post('/login', UserController.loginUser);
userRouter.get('/login', UserController.getAllUser) //모든 유저 조회
userRouter.post('/logout', UserController.logout);
userRouter.get('/register', UserController.getUser)
userRouter.patch('/edit', loginRequired, UserController.updateUser);
userRouter.delete('/delete', loginRequired, UserController.deleteUser);
//토큰 값 가져옴.
userRouter.get('/accessToken', UserController.accessToken);
userRouter.post('/refereshToken', UserController.refreshToken);
//관리자 기능 추후 활성화
// userRouter.get('/register', loginRequired, UserController.getUser);

export default userRouter;
