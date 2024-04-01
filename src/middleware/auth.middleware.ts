import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message } from '../message/schema/message.schema';
import { HTTP_STATUS, RES_MESSAGE, jwt } from 'src/constant/message.constant';
import { handleServerError } from './error-handler';

@Injectable()
export class MyMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name)
    private messageModel: mongoose.Model<Message>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers['authorization']) {
        return res.status(401).json({
          message: RES_MESSAGE.TOKEN_REQUIRED,
          statusCode: HTTP_STATUS.BAD_REQUEST,
        });
      }
      const token = req.headers['authorization'];

      const decoded = jwt.verify(token, process.env.SECRET) as { id: string };

      const user = await this.userModel.findOne({ _id: decoded.id });

      //Accessing the string from params as we are using * id in params is considered as string
      const param = req.params[0];

      //Spliting two ids with / and storing in senderId and recipientId
      const [senderId, recipientId] = param.split('/');
      if (!user) {
        return res.status(404).json({
          message: RES_MESSAGE.USER_NOT_FOUND,
          statusCode: HTTP_STATUS.BAD_REQUEST,
        });
      }

      //Will be executed if we are having senderId in body
      if (req.body.senderId && req.body.senderId !== decoded.id) {
        return res.status(404).json({
          message: RES_MESSAGE.TOKEN_NOT_MATCHING_SENDER,
          statusCode: HTTP_STATUS.BAD_REQUEST,
        });
      } else if (req.body.senderId && req.body.senderId === decoded.id) {
        // Does nothing if senderId in body matches decoded id
      } else if (senderId && recipientId) {
        //It will be executed if we are giving both ids in params
        if (senderId !== decoded.id && recipientId !== decoded.id) {
          return res.json({
            message: RES_MESSAGE.TOKEN_INCORRECT,
            statusCode: HTTP_STATUS.BAD_REQUEST,
          });
        }
      } else {
        const chat = await this.messageModel.findOne({ _id: req.params[0] });

        if (!chat) {
          return res.json({
            message: RES_MESSAGE.CHAT_NOT_FOUND,
            statusCode: HTTP_STATUS.NOT_FOUND,
          });
        }

        //Converting ObjectId into string for comparison
        const userid = user._id.toString();
        const chatid = chat.senderId.toString();

        if (chatid !== userid) {
          return res.json({
            message: RES_MESSAGE.NOT_ALLOWED,
            statusCode: HTTP_STATUS.UNAUTHORIZED,
          });
        }
      }
      next();
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }
}
