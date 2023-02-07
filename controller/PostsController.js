import PostService from "../services/PostService.js";

class PostsController {
  async getPosts(req, res, next) {
    try {
      const { page, searchQuery, tags } = req.query;
      const data = await PostService.getPosts(page, searchQuery, tags);
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  async getOnePost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await PostService.getOnePost(id);

      res.status(200).json(post);
    } catch (e) {
      next(e);
    }
  }

  async getPostsBySearch(req, res, next) {
    try {
      const posts = await PostService.getPostsBySearch(req.query);

      res.status(200).json(posts);
    } catch (e) {
      next(e);
    }
  }

  async createPost(req, res, next) {
    try {
      const newPost = await PostService.createPost(req.body, req.userId);

      res.status(201).json(newPost);
    } catch (e) {
      next(e);
    }
  }

  async updatePost(req, res, next) {
    try {
      const updatedPost = await PostService.updatePost(req.params.id, req.body);

      res.status(204).json(updatedPost);
    } catch (e) {
      next(e);
    }
  }

  async deletePost(req, res, next) {
    try {
      await PostService.deletePost(req.params.id);

      res.status(204).json({ message: "delete" });
    } catch (e) {
      next(e);
    }
  }

  async likePost(req, res, next) {
    try {
      await PostService.likePost(req.params.id, req.userId);

      res.status(204).json({ message: "success" });
    } catch (e) {
      next(e);
    }
  }

  async commentPost(req, res, next) {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      const post = await PostService.commentPost(id, comment);

      res.status(200).json(post);
    } catch (e) {
      next(e);
    }
  }
}

export default new PostsController();
