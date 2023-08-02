import express from 'express';
import PostController from '../controllers/post_controller.js';
import dotenv from 'dotenv';
import {upload} from '../config/s3.js'
import loginRequired from '../middlewares/login_required.js';
const post_router = express.Router();

dotenv.config();


//게시글 작성
post_router.post('/', loginRequired, upload.array('files'), PostController.createPost);

//내가 쓴 게시글 불러오기
post_router.get('/', loginRequired ,PostController.getAllPosts);

// 게시글 상세 가져오기!
post_router.get('/:postId', loginRequired, PostController.getPostById);

// 다른 유저의 게시글을 불러와야되는데...
post_router.get('/user/:email', loginRequired, PostController.getUserPosts);

//게시글 수정하기
post_router.patch('/:postId', loginRequired,PostController.updatePost);

//게시글 삭제하기
post_router.delete('/:postId',loginRequired, PostController.deletePost);

export default post_router;