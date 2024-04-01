import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import * as mongoose from 'mongoose';
import { Response } from 'express';
import {
  HTTP_STATUS,
  RES_MESSAGE,
  bcrypt,
  jwt,
} from 'src/constant/message.constant';
import { handleServerError } from 'src/middleware/error-handler';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  //Logic for creating a user if it does not exist

  async createUser(user: User, file: Express.Multer.File, res: Response) {
    try {
      user.profile = file ? file.path : null;
      const userExist = await this.userModel.find({
        $or: [
          {
            email: user.email,
          },
          { fullName: user.fullName },
        ],
      });

      if (userExist.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: RES_MESSAGE.EMAIL_IN_USE,
        });
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await this.userModel.create({
        fullName: user.fullName,
        email: user.email,
        password: hashedPassword,
        profile: user.profile,
      });
      return res.status(HTTP_STATUS.CREATED).json({
        message: RES_MESSAGE.REGISTERED,
        newUser,
      });
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }

  //Logic for Login the user if it already exist

  async loginUser(loginUser, res: Response) {
    try {
      const email = loginUser.email;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: RES_MESSAGE.USER_NOT_FOUND,
        });
      }
      const match = await bcrypt.compare(loginUser.password, user.password);

      if (!match) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: RES_MESSAGE.PASSWORD_INCORRECT,
        });
      }

      const tokenObject = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      };

      const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
        expiresIn: RES_MESSAGE.EXPIRE_TIME,
      });
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: RES_MESSAGE.LOGIN,
        jwtToken,
        tokenObject,
      });
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }

  //Logic for reseting the password if user exist

  async resetUserPassword(resetpassword, res: Response) {
    try {
      const email = resetpassword.email;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: RES_MESSAGE.USER_NOT_FOUND,
        });
      }
      const match = await bcrypt.compare(
        resetpassword.oldpassword,
        user.password,
      );
      if (!match) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: RES_MESSAGE.PASSWORD_INCORRECT,
        });
      }
      const hashedPassword = await bcrypt.hash(resetpassword.newpassword, 10);
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true },
      );
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: RES_MESSAGE.PASSWORD_RESET,
        updatedUser,
      });
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }
}
