import express from 'express';
import PostController from '../controllers/post_controller.js';
import dotenv from 'dotenv';
import {upload} from '../config/s3.js'
import loginRequired from '../middlewares/login_required.js';
const post_router = express.Router();

dotenv.config();

//게시글 작성
post_router.post('/', loginRequired, upload.array('images'), PostController.createPost);

//게시글 전부 불러오기
post_router.get('/', loginRequired ,PostController.getAllPosts);

// 게시글 가져오기!
post_router.get('/:postId', loginRequired, PostController.getPostById);

//게시글 수정하기
post_router.patch('/:postId', loginRequired,PostController.updatePost);

//게시글 삭제하기
post_router.delete('/:postId',loginRequired, PostController.deletePost);

export default post_router;