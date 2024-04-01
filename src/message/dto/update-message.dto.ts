import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Senders ID should not be empty' })
  readonly senderId?: Types.ObjectId;

  @IsString()
  @IsNotEmpty({ message: 'Recievers ID should not be empty' })
  readonly recipientId?: Types.ObjectId;

  @IsString()
  @IsNotEmpty({ message: 'Content should not be empty' })
  readonly content?: string;
}
