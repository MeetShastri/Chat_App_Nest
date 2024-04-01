import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Enter Your old password' })
  @MinLength(5, { message: 'Please enter password' })
  readonly oldpassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(5, { message: 'Please enter password with minimum 5 characters' })
  readonly newpassword: string;
}
