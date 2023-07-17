import LikeService from '../services/like_service.js';

const LikeController = {
  async addLikeCtrl  (req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
  
    const like = await LikeService.addLike(postId, userId);
  
    res.status(201).json(like);
  },
  async removeLikeCtrl  (req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
  
    const like = await LikeService.removeLike(postId, userId);
  
    res.status(200).json(like);
  },
  async getLikeCtrl  (req, res) {
    const { postId } = req.params;
  
    const likeCount = await LikeService.getLike(postId);
  
    res.status(200).json({ likeCount });
  },

}

export default LikeController;

