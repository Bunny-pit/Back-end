import express from 'express';
import LikeController from '../controllers/like_controller.js';

const router = express.Router();

router.post('/:postId', LikeController.addLikeCtrl);
router.delete('/:postId', LikeController.removeLikeCtrl);
router.get('/:postId', LikeController.getLikeCtrl);

export default router;
