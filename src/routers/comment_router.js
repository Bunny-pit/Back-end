import express from 'express';
import CommentController from '../controllers/comment_controller.js';

const comment_router = express.Router();

//댓글 작성
comment_router.post('/:postId',  CommentController.createComment);

//전체 댓글 가져오기
comment_router.get('/', CommentController.getComments);

//댓글 가져오기
comment_router.get('/:postId', CommentController.getCommentsByPostId);

// comment_router.get('/' , async () => {
//   console.log('댓글 테스트!')
// })

// // 댓글 가져오기!
// post_router.get('/:postId', PostController.getPostById);

// //댓글 수정하기
// post_router.patch('/:postId', PostController.updatePost);

// //댓글 삭제하기
// post_router.delete('/:postId', PostController.deletePost);

export default comment_router;