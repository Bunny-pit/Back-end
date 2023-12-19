import MainhomeFriends from '../database/models/mainhomeFriends_model.js';
import User from '../database/models/user_model.js';
import { uploadToS3, deleteFromS3 } from '../config/s3.js';

const MainhomeFriendsService = {
  createMainhomePost: async (oid, data, files) => {
    try {
      const user = await User.findById(oid);

      if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
      }
      let uploadedImages = await Promise.all(
        files.map(async file => {
          let uploadResult = await uploadToS3(file);
          return uploadResult.success ? uploadResult.url : null;
        }),
      );

      uploadedImages = uploadedImages.filter(url => url != null);

      const newPost = new MainhomeFriends({
        ...data,
        userId: oid,
        email: user.email,
        name: user.userName,
        profileImage: user.profileImg,
        images: uploadedImages,
        createdAt: Date.now(),
        uploadedAt: Date.now(),
      });

      await newPost.save();
      return newPost;
    } catch (err) {
      throw err;
    }
  },

  getAllMainhomePosts: async (oid, page, limit) => {
    try {
      const user = await User.findById(oid);
      const followedUserNames = user.followings;

      const followedUsers = await User.find({
        userName: { $in: followedUserNames },
      });

      const followedUserIds = followedUsers.map(user => user._id);

      followedUserIds.push(oid);

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

      await Promise.all(post.images.map(imageUrl => deleteFromS3(imageUrl)));

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
        reports: { $exists: true, $size: 3 },
      });
      return reportedPosts;
    } catch (err) {
      throw err;
    }
  },

  // 관리자 기능 신고 3회 이상 게시글 삭제
  deleteAdminPost: async postId => {
    try {
      await Promise.all(post.images.map(imageUrl => deleteFromS3(imageUrl)));

      const deletedPost = await MainhomeFriends.findByIdAndDelete(postId);
      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeFriendsService;
