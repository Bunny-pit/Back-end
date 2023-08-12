import express from 'express';
import UserController from '../controllers/user_controller.js';
import loginRequired from '../middlewares/login_required.js';
import adminCheck from '../middlewares/adminCheck.js';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('유저 루트 페이지 입니다.');
});

//유저 기능
userRouter.post('/register', UserController.createUser);
userRouter.post('/login', UserController.loginUser);
userRouter.post('/logout', UserController.logout);
userRouter.patch('/edit', loginRequired, UserController.updateUser);
userRouter.delete('/delete', loginRequired, UserController.deleteUser);

//토큰 확인 기능
userRouter.get('/accessToken', UserController.accessToken);
userRouter.post('/refereshToken', UserController.refreshToken);

//관리자 기능 : adminCheck 미들웨어 추후 사용.
userRouter.get('/login', UserController.getAllUser); //모든 유저 조회. 개발 편의를 위해 임시 활성화 하였음.
// 관리자 기능 -> 유저 삭제
userRouter.delete('/admin/deleteUser', UserController.adminDeleteUser);

// userRouter.get('/register', adminCheck, UserController.getUser); // loginRequired 미들웨어에서 넘겨받은 userOid로 특정 유저 호회

//팔로우 기능
userRouter.post('/toggleFollow', loginRequired, UserController.toggleFollow);
userRouter.get('/followings', UserController.getFollowings);
userRouter.get('/followers', UserController.getFollowers);

//검색기능
userRouter.get('/search', UserController.searchUser);
export default userRouter;
