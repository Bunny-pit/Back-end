import LikeService from '../services/like_service.js';
import User from '../database/models/user_model.js';

const LikeController = {
  async createLike  (req, res) {
    try {
      const {postId} = req.params;
      const user = await User.findById({ _id: req.oid });
      const userId = user._id;
      const like = await LikeService.createLike(postId,userId);
      res.status(201).json({ success: true, like });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
  async getLike  (req, res) {
    const postId = req.params.postId;
    const userId = req.body.userId; // GET 요청에서는 요청 본문이 없으므로 쿼리에서 userId를 가져옵니다.

    try {
        const result = await LikeService.getLike(postId, userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  },
  async deleteLike  (req, res) {
    const postId = req.params.postId;
    const userId = req.body.userId;

    try {
        const result = await LikeService.deleteLike(postId, userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  },

}

export default LikeController;

