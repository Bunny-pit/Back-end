import CommentService from '../services/comment_service.js';


const CommentController = {
  async createComment  (req, res){
      try {
          const { comment, userName, userId } = req.body;
          const { postId } = req.params;
          // const { userId,userName } = req;
          const newComment = await CommentService.createComment(comment, postId, userId,userName);
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
      console.log('postId' , postId)
      try {
          const comments = await CommentService.getCommentsByPostId(postId);
          console.log('포스트아이디 체크포인트 1', postId)
          res.json(comments);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },
}
export default CommentController;
