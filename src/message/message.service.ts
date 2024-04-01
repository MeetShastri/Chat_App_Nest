import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.schema';
import mongoose from 'mongoose';
import { User, UserModel } from 'src/user/schema/user.schema';
import { MessageDto } from './dto/message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Response } from 'express';
import { HTTP_STATUS, RES_MESSAGE } from 'src/constant/message.constant';
import { handleServerError } from 'src/middleware/error-handler';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: mongoose.Model<Message>,
    @InjectModel(UserModel)
    private userModel: mongoose.Model<User>,
  ) {}

  //Logic for sending the message if sender and reciever are present
  async sendMessage(messagedto: MessageDto, res: Response) {
    if (
      !messagedto.senderId ||
      !messagedto.recipientId ||
      !messagedto.content
    ) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: RES_MESSAGE.FIELDS_REQUIRED,
      });
    }
    const sender = await this.userModel.findById(messagedto.senderId);
    if (!sender) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RES_MESSAGE.SENDER_NOT_FOUND,
      });
    }
    const recipient = await this.userModel.findById(messagedto.recipientId);
    if (!recipient) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RES_MESSAGE.RECIEVER_NOT_FOUND,
      });
    }
    try {
      const message = await this.messageModel.create(messagedto);
      return res.status(HTTP_STATUS.SUCCESS).json({
        messg: RES_MESSAGE.MESSAGE_SENT,
        message,
      });
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }

  //Logic for getting all the chat between 2 users (sender and reciever)
  async getChat(
    senderId: string,
    recipientId: string,
    page: number = 1,
    limit: number = 10,
    res: Response,
  ) {
    try {
      const skip = (page - 1) * limit;
      const sender = await this.userModel.findById(senderId);
      if (!sender) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: RES_MESSAGE.SENDER_NOT_FOUND,
        });
      }

      const recipient = await this.userModel.findById(recipientId);
      if (!recipient) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: RES_MESSAGE.RECIEVER_NOT_FOUND,
        });
      }

      const messages = await this.messageModel
        .find({
          $or: [
            { senderId, recipientId },
            { senderId: recipientId, recipientId: senderId },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      if (messages.length <= 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: RES_MESSAGE.NO_CHATS,
        });
      }
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: RES_MESSAGE.YOUR_CHATS,
        messages,
      });
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }

  //Logic for updating the chat if it is present
  async updateChat(
    updatemessage: UpdateMessageDto,
    chatid: string,
    res: Response,
  ) {
    try {
      const updatedMessage = await this.messageModel.findOneAndUpdate(
        { _id: chatid },
        { ...updatemessage },
        { new: true },
      );
      if (updatedMessage) {
        return res.status(HTTP_STATUS.SUCCESS).json({
          message: RES_MESSAGE.MESSAGE_UPDATED,
          updatedMessage,
        });
      }
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }

  //Logic for deleting the chat if it is present
  async deleteChat(chatid: string, res: Response) {
    try {
      const chat = await this.messageModel.findById(chatid);
      if (!chat) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: RES_MESSAGE.CHAT_NOT_FOUND,
        });
      }
      const deletedChat = await this.messageModel.findByIdAndDelete(chatid);
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: RES_MESSAGE.CHAT_DELETED,
        deletedChat,
      });
    } catch (error) {
      return handleServerError(res, error); //Here we are using Helper function for reusability
    }
  }
}
