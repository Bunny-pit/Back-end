const express = require("express");
const router = express.Router();
const MainhomeController = require("../controllers/Mainhome_controller");

// 게시글 생성
router.post("/", MainhomeController.createPost);

// 게시글 모두 불러오기
router.get("/", MainhomeController.getAllPosts);

// 게시글 수정하기
router.patch("/:id", MainhomeController.updatePost);

// 게시글 삭제하기
router.delete("/:id", MainhomeController.deletePost);

module.exports = router;
