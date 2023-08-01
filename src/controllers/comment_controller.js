import CommentService from '../services/comment_service.js';


const CommentController = {
  async createComment  (req, res){
      try {
          const { comment} = req.body;
   
          // const { userId,userName } = req;
          const newComment = await CommentService.createComment(comment, req);
          console.log('comment : ',newComment)
          res.status(200).json(newComment);
          console.log('res 전송 성공!')
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },
  async getComments (req, res) {
    try {
        const comments = await CommentService.getAllComments();
        res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
},
  async getCommentsByPostId (req, res) {
      const { postId } = req.params;
      try {
          const comments = await CommentService.getCommentsByPostId(postId);
          res.json(comments);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },
  async updateComment (req, res) {
    try {
      const { postId, commentId } = req.params;
      const newComment = req.body;
      const updateComment = await CommentService.updateComment(commentId, newComment);
      if (!updateComment) {
        return res.status(404).json({ error: '댓글을 찾지 못했습니다.' });
      }
        res.json(updateComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async deleteComment(req, res) {
    try {
      const { postId, commentId } = req.params;
      const deletedComment = await CommentService.deleteComment(commentId);

      if (!deletedComment) {
        return res.status(404).json({ error: '댓글을 찾지 못했습니다.' });
      }

      res.json({ message: '게시글을 성공적으로 삭제했습니다.', deletedComment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

}
export default CommentController;
