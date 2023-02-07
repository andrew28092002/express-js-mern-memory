import UserModal from "../modals/UserModal.js";
import bcrypt from "bcryptjs";
import MailService from "./MailService.js";
import TokenService from "./TokenService.js";
import * as uuid from "uuid";
import { ApiError } from "../exceptions/ApiError.js";

class UserService {
  async createUser({
    firstName,
    lastName,
    email,
    password,
    confirmedPassword,
  }) {
    const existingUser = await UserModal.findOne({ email });

    if (existingUser) {
      throw ApiError.BadRequest("User already exist");
    }

    if (password !== confirmedPassword)
      throw ApiError.BadRequest("Passwords don't match");

    const hashedPassword = await bcrypt.hash(password, 12);
    const activationLink = uuid.v4();

    const newUser = await UserModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      activationLink,
    });

    // await MailService.sendActivaitonEmail(
    //   email,
    //   `${process.env.API_URL}/user/activate/${activationLink}`
    // );

    const tokens = TokenService.generateTokens({
      email: newUser.email,
      id: newUser._id,
    });

    await TokenService.saveToken(newUser._id, tokens.refreshToken);

    return {
      user: newUser,
      tokens,
    };
  }

  async authUser({ email, password }) {
    const existUser = await UserModal.findOne({ email });

    if (!existUser) {
      throw ApiError.NotFound("User not found");
    }

    const isTruePassword = await bcrypt.compare(password, existUser.password);

    if (!isTruePassword) {
      throw ApiError.BadRequest("Incorrect password");
    }

    const tokens = TokenService.generateTokens({
      email: existUser.email,
      id: existUser._id,
    });

    await TokenService.saveToken(existUser._id, tokens.refreshToken);

    return {
      user: existUser,
      tokens,
    };
  }

  async activateUser({ activationLink }) {
    const currentUser = await UserModal.findOne({ activationLink });

    if (!currentUser) {
      throw ApiError.NotFound("User not found");
    }

    currentUser.activationLink = true;
    await currentUser.save();
  }

  async logout({ refreshToken }) {
    await TokenService.removeToken(refreshToken);
  }

  async refresh({ refreshToken }) {
    if (!refreshToken) {
      throw ApiError.Unauthorized();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const refreshTokenFromDb = TokenService.findToken(refreshToken);

    if (!userData || !refreshTokenFromDb) {
      throw ApiError.Unauthorized();
    }

    const tokens = TokenService.generateTokens({
      email: userData.email,
      id: userData._id,
    });

    await TokenService.saveToken(userData._id, tokens.refreshToken);
    return {
      user: userData,
      tokens,
    };
  }
}

export default new UserService();
