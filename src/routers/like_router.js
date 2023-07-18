import express from 'express';
import LikeController from '../controllers/like_controller.js';

const router = express.Router();

router.post('/:postId', LikeController.createLike);
router.get('/:postId', LikeController.getLike);
router.delete('/:postId', LikeController.deleteLike);

export default router;
