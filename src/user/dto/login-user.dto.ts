import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(5, { message: 'Please enter password' })
  readonly password: string;
}
