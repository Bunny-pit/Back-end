import express from "express";
import PostController from "../controllers/post_controller.js";

const post_router = express.Router();

//게시글 작성
post_router.post("/", PostController.createPost);

//게시글 전부 불러오기
post_router.get("/", PostController.getAllPosts);

//게시글 수정하기
post_router.patch("/:postId", PostController.updatePost);

//게시글 삭제하기
post_router.delete("/:postId", PostController.deletePost);

export default post_router;
