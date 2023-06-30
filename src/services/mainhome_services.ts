import mongoose from "mongoose";
import Mainhome from "../models/schemas/mainhome_schema";
import User from "../models/schemas/user_schema";

const mainhomeService = {
  //메인 홈 게시글 생성
  async createContent(
    user_id: string,
    name: string,
    profileImage: string,
    content: string,
  ) {
    try {
      const mainhome = new Mainhome({
        user_id,
        name,
        profileImage,
        content,
      });
      await mainhome.save();

      const user = await User.findOne({ _id: user_id });
      if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      user.postNum++;
      await user.save();

      return mainhome;
    } catch (error) {
      console.error(error);
      throw new Error("메인 홈 게시글 생성에 실패했습니다.");
    }
  },

  //메인 홈 게시글 수정

  async updateContent(user_id: string, content_id: string, content: string) {
    try {
      const mainhome = await Mainhome.findById(content_id);
      if (!mainhome) {
        throw new Error("메인 홈 게시글을 찾을 수 없습니다.");
      }

      //해당 게시글을 작성한 작성자만 수정 가능하도록 구현
      if (mainhome.user_id !== user_id) {
        throw new Error("작성자만 질문을 수정할 수 있습니다.");
      }

      mainhome.content = content;
      await mainhome.save();

      return mainhome;
    } catch (error) {
      throw new Error("메인홈 게시글 수정에 실패했습니다.");
    }
  },
};
