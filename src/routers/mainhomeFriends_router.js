import express from 'express';
import MainhomeFriendsController from '../controllers/mainhomeFriends_controller.js';
import loginRequired from '../middlewares/login_required.js';

const mainhomeFriends_router = express.Router();

//게시글 작성
mainhomeFriends_router.post(
  '/friends',
  loginRequired,
  MainhomeFriendsController.createMainhomePost,
);

//게시글 전부 불러오기
mainhomeFriends_router.get(
  '/friends',
  MainhomeFriendsController.getAllMainhomePosts,
);

//게시글 수정하기
mainhomeFriends_router.patch(
  '/friends/:id',
  loginRequired,
  MainhomeFriendsController.updateMainhomePost,
);

//게시글 삭제하기
mainhomeFriends_router.delete(
  '/friends/:id',
  loginRequired,
  MainhomeFriendsController.deleteMainhomePost,
);

export default mainhomeFriends_router;
