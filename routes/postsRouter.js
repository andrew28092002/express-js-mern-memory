import { Router } from "express";
import PostsController from "../controller/PostsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const postRouter = new Router()

postRouter.get('/', PostsController.getPosts)
postRouter.get('/:id', PostsController.getOnePost)
postRouter.post('/', authMiddleware,  PostsController.createPost)
postRouter.patch('/:id', authMiddleware, PostsController.updatePost)
postRouter.delete('/:id', authMiddleware, PostsController.deletePost)
postRouter.patch('/:id/likePost', authMiddleware, PostsController.likePost)
postRouter.put('/:id/commentPost', authMiddleware, PostsController.commentPost)



export {postRouter}