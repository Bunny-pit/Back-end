import express from 'express';
import MainhomeSecretController from '../controllers/mainhomeSecret_controller.js';
import { upload } from '../config/s3.js';
import MainhomeFriendsController from '../controllers/mainhomeFriends_controller.js';
import loginRequired from '../middlewares/login_required.js';

const mainhome_router = express.Router();

//--Secret게시판 라우터--

mainhome_router.post(
  '/secret',
  loginRequired,
  upload.array('images'),
  MainhomeSecretController.createMainhomePost,
);

mainhome_router.get('/secret', MainhomeSecretController.getAllMainhomePosts);

mainhome_router.patch(
  '/secret/:id',
  loginRequired,
  MainhomeSecretController.updateMainhomePost,
);

mainhome_router.delete(
  '/secret/:id',
  loginRequired,
  MainhomeSecretController.deleteMainhomePost,
);

mainhome_router.post(
  '/secret/report/:id',
  loginRequired,
  MainhomeSecretController.reportPost,
);

mainhome_router.get(
  '/secret/reported',
  loginRequired,
  MainhomeSecretController.getReportPosts,
);

//--Friends게시판 라우터--

mainhome_router.post(
  '/friends',
  loginRequired,
  upload.array('images'),
  MainhomeFriendsController.createMainhomePost,
);

mainhome_router.get(
  '/friends',
  loginRequired,
  MainhomeFriendsController.getAllMainhomePosts,
);

mainhome_router.patch(
  '/friends/:id',
  loginRequired,
  MainhomeFriendsController.updateMainhomePost,
);

mainhome_router.delete(
  '/friends/:id',
  loginRequired,
  MainhomeFriendsController.deleteMainhomePost,
);

mainhome_router.post(
  '/friends/report/:id',
  loginRequired,
  MainhomeFriendsController.reportPost,
);

mainhome_router.get(
  '/friends/reported',
  // loginRequired,
  MainhomeFriendsController.getReportedPosts,
);

// 관리자가 3회 이상 신고받은 게시글 삭제하기
mainhome_router.delete(
  '/report/friends/:id',
  MainhomeFriendsController.deleteAdminPost,
);

mainhome_router.delete(
  '/report/secret/:id',
  MainhomeSecretController.deleteAdminPost,
);

export default mainhome_router;
