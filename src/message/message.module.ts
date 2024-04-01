import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schema/message.schema';
import { UserSchema } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Message', schema: MessageSchema },
      { name: 'User', schema: UserSchema },
    ]),
    UserModule,
  ],
  controllers: [MessageController, UserController],
  providers: [MessageService, UserService],
  exports: [MongooseModule],
})
export class MessageModule {}
