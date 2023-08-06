import express from 'express';
import MainhomeController from '../controllers/mainhome_controller.js';
import loginRequired from '../middlewares/login_required.js';

const mainhome_router = express.Router();

//게시글 작성
mainhome_router.post('/', loginRequired, MainhomeController.createMainhomePost);

//게시글 전부 불러오기
mainhome_router.get('/', MainhomeController.getAllMainhomePosts);

//게시글 수정하기
mainhome_router.patch(
  '/:id',
  loginRequired,
  MainhomeController.updateMainhomePost,
);

//게시글 삭제하기
mainhome_router.delete(
  '/:id',
  loginRequired,
  MainhomeController.deleteMainhomePost,
);

export default mainhome_router;