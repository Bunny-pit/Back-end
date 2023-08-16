import MainhomeFriends from '../database/models/mainhomeFriends_model.js';
import User from '../database/models/user_model.js';

const MainhomeFriendsService = {
  createMainhomePost: async (oid, data) => {
    try {
      const user = await User.findById(oid);

      if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
      }

      const newPost = new MainhomeFriends({
        ...data,
        userId: oid,
        email: user.email,
        name: user.userName,
        profileImage: user.profileImg,
      });

      await newPost.save();
      return newPost;
    } catch (err) {
      throw err;
    }
  },

  getAllMainhomePosts: async (oid, page, limit) => {
    try {
      // 로그인한 사용자의 팔로우 목록 가져오기
      const user = await User.findById(oid);
      const followedUserNames = user.followings;

      // 팔로우한 사용자들의 ObjectId를 조회
      const followedUsers = await User.find({
        userName: { $in: followedUserNames },
      });

      const followedUserIds = followedUsers.map(user => user._id);

      // 로그인한 사용자의 oid도 팔로우 목록에 추가
      followedUserIds.push(oid);

      // 팔로우한 사용자들의 게시글만 조회
      const posts = await MainhomeFriends.find({
        userId: { $in: followedUserIds },
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return posts.map(post => ({
        ...post._doc,
        email: post.email,
      }));
    } catch (err) {
      throw err;
    }
  },

  updateMainhomePost: async (oid, postId, data) => {
    try {
      const post = await MainhomeFriends.findById(postId);
      if (!post) {
        throw new Error('게시글을 찾지 못했습니다.');
      } else if (post.userId.toString() !== oid.toString()) {
        throw new Error('게시글 수정 권한이 없습니다.');
      }

      const updatedPost = await MainhomeFriends.findByIdAndUpdate(
        postId,
        {
          ...data,
          email: post.email,
        },
        {
          new: true,
        },
      );

      return updatedPost;
    } catch (err) {
      throw err;
    }
  },

  deleteMainhomePost: async (oid, postId) => {
    try {
      const post = await MainhomeFriends.findById(postId);
      if (!post) {
        throw new Error('게시글을 찾지 못했습니다.');
      } else if (post.userId.toString() !== oid.toString()) {
        throw new Error('게시글 삭제 권한이 없습니다.');
      }

      const deletedPost = await MainhomeFriends.findByIdAndDelete(postId);

      return deletedPost;
    } catch (err) {
      throw err;
    }
  },

  reportPost: async (oid, postId, reason) => {
    try {
      const user = await User.findById(oid);
      if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
      }

      const post = await MainhomeFriends.findById(postId);
      if (!post) {
        throw new Error('게시글을 찾지 못했습니다.');
      }

      // 중복 신고 체크
      const alreadyReported = post.reports.some(
        report => report.reportedBy === user.userName,
      );
      if (alreadyReported) {
        throw new Error('이미 신고한 게시글입니다.');
      }

      post.reports.push({
        reportedBy: user.userName,
        reason: reason,
        userId: oid,
      });

      await post.save();

      return post;
    } catch (err) {
      throw err;
    }
  },

  getReportedPosts: async () => {
    try {
      const reportedPosts = await MainhomeFriends.find({
        $expr: { $gte: [{ $size: '$reports' }, 3] },
      });
      return reportedPosts;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeFriendsService;
