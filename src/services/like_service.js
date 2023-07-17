import Like from '../database/models/like_model.js';


const LikeService = {
  addLike : async (postId, userId) => {
  const like = await Like.findOne({ postId });

    if (!like) {
      const newLike = new Like({ 
        postId,
        userId: [userId],
        like: true 
      });
      
      await newLike.save();

      return newLike;
    } else {
      like.userId.push(userId);
      like.like = true;

      await like.save();

      return like;
    }
  },

  removeLike : async(postId, userId) =>{
    try {
      const like = await Like.findOne({ postId });
      if (!like) throw new Error('Post not found');

      // Check if the like object is not null
      if (like && like.userId) {
          const index = like.userId.indexOf(userId);

          if (index > -1) {
              like.userId.splice(index, 1);
              await like.save();
          } else {
              throw new Error('User has not liked the post');
          }
      } else {
          throw new Error('User has not liked the post');
      }

      return like;
  } catch (error) {
      throw error;
  }
  },
  
  getLike : async (postId) => {
    const like = await Like.findOne({ postId });
    const count = like.userId.length;
    const likedUser = like.userId;
    if (like) {
      return  {count, likedUser}; 
    } else {
      return 0;
    }
  },
}
  
export default LikeService;
