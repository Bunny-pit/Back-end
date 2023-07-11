import express from "express";
import mainhomeController from "../controllers/mainhome_controller.js";

const mainhomeRouter = express.Router();

//게시글 작성
mainhomeRouter.post("/", mainhomeController.createMainhomePost);

//게시글 전부 불러오기
mainhomeRouter.get("/", mainhomeController.getAllMainhomePosts);

//게시글 수정하기
mainhomeRouter.patch("/:id", mainhomeController.updateMainhomePost);

//게시글 삭제하기
mainhomeRouter.delete("/:id", mainhomeController.deleteMainhomePost);

export default mainhomeRouter;
