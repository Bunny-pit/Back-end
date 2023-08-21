import express from 'express';
import MainhomeUnknownController from '../controllers/mainhomeUnknown_controller.js';
import MainhomeFriendsController from '../controllers/mainhomeFriends_controller.js';
import loginRequired from '../middlewares/login_required.js';

const mainhome_router = express.Router();

//--unknown게시판 라우터--

//게시글 작성
mainhome_router.post(
  '/unknown',
  loginRequired,
  MainhomeUnknownController.createMainhomePost,
);

//게시글 전부 불러오기
mainhome_router.get('/unknown', MainhomeUnknownController.getAllMainhomePosts);

//게시글 수정하기
mainhome_router.patch(
  '/unknown/:id',
  loginRequired,
  MainhomeUnknownController.updateMainhomePost,
);

//게시글 삭제하기
mainhome_router.delete(
  '/unknown/:id',
  loginRequired,
  MainhomeUnknownController.deleteMainhomePost,
);

//게시글 신고하기
mainhome_router.post(
  '/unknown/report/:id',
  loginRequired,
  MainhomeUnknownController.reportPost,
);

//3회 이상 신고된 게시글 불러오기
mainhome_router.get(
  '/unknown/reported',
  loginRequired,
  MainhomeUnknownController.getReportPosts,
);

//--friends게시판 라우터--

//게시글 작성
mainhome_router.post(
  '/friends',
  loginRequired,
  MainhomeFriendsController.createMainhomePost,
);

//게시글 전부 불러오기
mainhome_router.get(
  '/friends',
  loginRequired,
  MainhomeFriendsController.getAllMainhomePosts,
);

//게시글 수정하기
mainhome_router.patch(
  '/friends/:id',
  loginRequired,
  MainhomeFriendsController.updateMainhomePost,
);

//게시글 삭제하기
mainhome_router.delete(
  '/friends/:id',
  loginRequired,
  MainhomeFriendsController.deleteMainhomePost,
);

//게시글 신고하기
mainhome_router.post(
  '/friends/report/:id',
  loginRequired,
  MainhomeFriendsController.reportPost,
);

//3회 이상 신고된 게시글 불러오기
mainhome_router.get(
  '/friends/reported',
  loginRequired,
  MainhomeFriendsController.getReportedPosts,
);

export default mainhome_router;
