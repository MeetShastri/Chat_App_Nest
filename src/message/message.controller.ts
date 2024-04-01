import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from './dto/message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Response } from 'express';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  //Route for Sending the message
  @Post('sendmessage')
  async sendMessage(
    @Body(new ValidationPipe()) messagedto: MessageDto,
    @Res() res: Response,
  ) {
    return this.messageService.sendMessage(messagedto, res);
  }

  //Route used for getting chats between two users
  //Added Pagination so that long chats can be broken down in multiple pages
  @Get(':senderId/:recipientId')
  async getChat(
    @Param('senderId') senderId: string,
    @Param('recipientId') recipientId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res: Response,
  ) {
    return this.messageService.getChat(senderId, recipientId, page, limit, res);
  }

  //Route for updating the chat
  @Patch(':chatid')
  async updateChat(
    @Body() updatemessage: UpdateMessageDto,
    @Param('chatid') chatid: string,
    @Res() res: Response,
  ) {
    return this.messageService.updateChat(updatemessage, chatid, res);
  }

  //Route for deleting the chat
  @Delete(':chatid')
  async deleteChat(@Param('chatid') chatid: string, @Res() res: Response) {
    return this.messageService.deleteChat(chatid, res);
  }
}
