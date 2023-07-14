import express from 'express';
import CommentController from '../controllers/comment_controller.js';

const comment_router = express.Router();

//댓글 작성
comment_router.post('/:postId',  CommentController.createComment);

//전체 댓글 가져오기
comment_router.get('/', CommentController.getComments);

//댓글 가져오기
comment_router.get('/:postId', CommentController.getCommentsByPostId);

// //댓글 수정하기
comment_router.patch('/:postId/:commentId', CommentController.updateComment);

// //댓글 삭제하기
comment_router.delete('/:postId/:commentId', CommentController.deleteComment);

export default comment_router;