import Like from '../database/models/like_model.js';


const LikeService = {
  createLike : async (postId, userId) => {

    const like = await Like.findOne({ postId });
    let liked = false;  

  if (like) {
    const userIndex = like.userId.indexOf(userId);

    if (userIndex > -1) {
      like.userId.splice(userIndex, 1);

      if (like.userId.length === 0) {
        like.liked = false;
      }
    } else {
      like.userId.push(userId);
      liked = true;
      like.liked = true;
    }

    await like.save();
  } else {
    like = new Like({ postId, userId: [userId], liked: true });
    liked = true;
    await like.save();
  }

  return { liked, count: like.userId.length };
  },
  getLike : async (postId, userId) => {
    const like = await Like.findOne({ postId});
    return like
  
  },
  deleteLike : async(postId, userId) =>{
    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
        await existingLike.remove();
        return { message: 'Like removed' };
    } else {
        throw new Error('Like not found');
    }
  },
  
  
}
  
export default LikeService;
