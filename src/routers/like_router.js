import express from 'express';
import LikeController from '../controllers/like_controller.js';
import loginRequired from '../middlewares/login_required.js';

const router = express.Router();

router.post('/:postId', loginRequired, LikeController.createLike);
router.get('/:postId', loginRequired, LikeController.getLike);
router.delete('/:postId', loginRequired, LikeController.deleteLike);

export default router;
