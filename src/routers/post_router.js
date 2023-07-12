import express from "express";
import PostController from "../controllers/post_controller.js";
import dotenv from "dotenv";
import {upload} from "../config/s3.js"

dotenv.config();

//게시글 작성
post_router.post("/",  upload.array('images'), PostController.createPost);

//게시글 전부 불러오기
post_router.get("/", PostController.getAllPosts);

//게시글 수정하기
post_router.patch("/:postId", PostController.updatePost);

//게시글 삭제하기
post_router.delete("/:postId", PostController.deletePost);

export default post_router;