import { Router } from "express";
import UserController from "../controller/UserController.js";
import { body } from "express-validator";

const userRouter = new Router();

userRouter.post("/signin", UserController.authUser);
userRouter.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("firstName").isLength({ min: 2 }),
  body("lastName").isLength({ min: 2 }),
  UserController.createUser
);
userRouter.post("/activate/:link", UserController.activateUser);
userRouter.get('/logout', UserController.logout)
userRouter.get('/refresh', UserController.refresh)

export { userRouter };
