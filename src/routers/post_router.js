import express from "express";
import PostController from "../controllers/post_controller.js";
import multer from 'multer';

const post_router = express.Router();
const upload = multer({ dest: 'uploads/' });

//게시글 작성
post_router.post("/",  upload.array('images', 10), PostController.createPost);
// 이미지 필드의 이름, 최대 10개 까지 업로드 가능

//게시글 전부 불러오기
post_router.get("/", PostController.getAllPosts);

// 게시글 가져오기!
post_router.get('/:postId', PostController.getPostById);

//게시글 수정하기
post_router.patch("/:postId", PostController.updatePost);

//게시글 삭제하기
post_router.delete("/:postId", PostController.deletePost);

export default post_router;
