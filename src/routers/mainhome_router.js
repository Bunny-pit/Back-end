import express from "express";
import MainhomeController from "../controllers/Mainhome_controller.js";

const mainhome_router = express.Router();

//게시글 작성
mainhome_router.post("/", MainhomeController.createPost);

//게시글 전부 불러오기
mainhome_router.get("/", MainhomeController.getAllPosts);

//게시글 수정하기
mainhome_router.patch("/:id", MainhomeController.updatePost);

//게시글 삭제하기
mainhome_router.delete("/:id", MainhomeController.deletePost);

export default mainhome_router;
