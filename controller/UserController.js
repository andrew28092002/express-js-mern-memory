import UserService from "../services/UserService.js";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/ApiError.js";

class UserController {
  async createUser(req, res, next) {
    try {
      const isErrors = validationResult(req);
      if (!isErrors) {
        throw ApiError.BadRequest("Erros in fields", isErrors.errors);
      }

      const { user, tokens } = await UserService.createUser(req.body);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json({ user, ...tokens });
    } catch (e) {
      next(e);
    }
  }

  async authUser(req, res, next) {
    try {
      const { user, tokens } = await UserService.authUser(req.body);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      console.log(req.headers.authorization)
      res.status(200).json({ user, ...tokens });
    } catch (e) {
      next(e);
    }
  }

  async activateUser(req, res, next) {
    try {
      await UserService.activateProfile(req.params);

      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      UserService.logout(req.cookies);

      res.clearCookie("refreshToken");
      res.status(200).json({ message: "User logout" });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { user, tokens } = await UserService.refresh(req.cookies);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(200).json({ token: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
