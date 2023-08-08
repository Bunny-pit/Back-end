import express from 'express';
import MainhomeUnknownController from '../controllers/mainhomeUnknown_controller.js';
import loginRequired from '../middlewares/login_required.js';

const mainhomeUnknown_router = express.Router();

//게시글 작성
mainhomeUnknown_router.post(
  '/unknown',
  loginRequired,
  MainhomeUnknownController.createMainhomePost,
);

//게시글 전부 불러오기
mainhomeUnknown_router.get(
  '/unknown',
  MainhomeUnknownController.getAllMainhomePosts,
);

//게시글 수정하기
mainhomeUnknown_router.patch(
  '/unknown/:id',
  loginRequired,
  MainhomeUnknownController.updateMainhomePost,
);

//게시글 삭제하기
mainhomeUnknown_router.delete(
  '/unknown/:id',
  loginRequired,
  MainhomeUnknownController.deleteMainhomePost,
);

export default mainhomeUnknown_router;
