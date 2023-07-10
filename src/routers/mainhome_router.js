import express from "express";
import MainhomeController from "../controllers/mainhome_controller.js";

const MainhomeRouter = express.Router();

//게시글 작성
MainhomeRouter.post("/", MainhomeController.createMainhomePost);

//게시글 전부 불러오기
MainhomeRouter.get("/", MainhomeController.getAllMainhomePosts);

//게시글 수정하기
MainhomeRouter.patch("/:id", MainhomeController.updateMainhomePost);

//게시글 삭제하기
MainhomeRouter.delete("/:id", MainhomeController.deleteMainhomePost);

export default MainhomeRouter;
