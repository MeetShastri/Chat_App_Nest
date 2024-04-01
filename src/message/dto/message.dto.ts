import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class MessageDto {
  @IsNotEmpty({ message: 'Senders ID should not be empty' })
  readonly senderId: Types.ObjectId;

  @IsNotEmpty({ message: 'Recievers ID should not be empty' })
  readonly recipientId: Types.ObjectId;

  @IsString()
  @IsNotEmpty({ message: 'Content should not be empty' })
  readonly content: string;
}
