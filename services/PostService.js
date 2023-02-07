import PostModal from "../modals/PostModal.js";
import { ApiError } from "./../exceptions/ApiError.js";
import mongoose from "mongoose";

class PostService {
  async getPosts(pageNumber, searchQuery, tags) {
    const LIMIT = 6;
    const startIndex = (Number(pageNumber) - 1) * LIMIT;
    const title = new RegExp(searchQuery, "i");
    let posts, total;

    if (searchQuery !== "none" || tags) {
      total = await PostModal.countDocuments({
        $or: [{ title }, { tags: { $in: tags.split(",") } }],
      });

      console.log(total);
      posts = await PostModal.find({
        $or: [{ title }, { tags: { $in: tags.split(",") } }],
      })
        .sort({ _id: -1 })
        .limit(LIMIT)
        .skip(startIndex);
    } else {
      total = await PostModal.countDocuments({});
      posts = await PostModal.find()
        .sort({ _id: -1 })
        .limit(LIMIT)
        .skip(startIndex);
    }

    return {
      posts,
      currentPage: Number(pageNumber),
      countPages: Math.ceil(total / LIMIT),
    };
  }

  async getOnePost(id){
    const post = await PostModal.findById(id)

    return {
      post
    }
  }

  async createPost(fields, userId) {
    const newPost = await new PostModal({ ...fields, creatorId: userId });
    newPost.save();

    return newPost;
  }

  async updatePost(id, fields) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.NotFound("No posts with current id");
    }

    const updatedPost = await PostModal.findByIdAndUpdate(id, fields, {
      new: true,
    });

    return updatedPost;
  }

  async deletePost(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.NotFound("No posts with current id");
    }

    await PostModal.findByIdAndDelete(id);
  }

  async likePost(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.NotFound("No posts with current id");
    }

    const currentPost = await PostModal.findById(id);
    const isContainLikes = currentPost.likes.findIndex(
      (id) => id === String(userId)
    );

    if (isContainLikes === -1) {
      currentPost.likes.push(String(userId));
    } else {
      currentPost.likes = currentPost.likes.filter(
        (id) => id !== String(userId)
      );
    }
    currentPost.save();
  }

  async commentPost(id, comment) {
    const post = await PostModal.findById(id)

    post.comments.push(comment)
    post.save()

    return post
  }
}

export default new PostService();
