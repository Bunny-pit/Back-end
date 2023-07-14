import express from 'express';
import MainhomeController from '../controllers/mainhome_controller.js';

const mainhomeRouter = express.Router();

//게시글 작성
mainhome_router.post('/', MainhomeController.createMainhomePost);

//게시글 전부 불러오기
mainhome_router.get('/', MainhomeController.getAllMainhomePosts);

//게시글 수정하기
mainhome_router.patch('/:id', MainhomeController.updateMainhomePost);

//게시글 삭제하기
mainhome_router.delete('/:id', MainhomeController.deleteMainhomePost);

export default mainhomeRouter;
