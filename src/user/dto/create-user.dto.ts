import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(5, { message: 'Name must be 5 characters long' })
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  profile: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(5, { message: 'Password must be 6 characters long' })
  readonly password: string;
}
