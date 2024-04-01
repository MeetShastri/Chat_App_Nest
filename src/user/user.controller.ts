import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //Route for registering the user
  @Post('register')
  @UseInterceptors(FileInterceptor('profile'))
  async createUser(
    @UploadedFile() file,
    @Body(new ValidationPipe()) createuser: CreateUserDto,
    @Res() res: Response,
  ) {
    return this.userService.createUser(createuser, file, res);
  }

  //Route for login the user
  @Post('login')
  async loginUser(@Body() loginuser: LoginUserDto, @Res() res: Response) {
    return this.userService.loginUser(loginuser, res);
  }

  //Route for Resetting the password
  @Post('resetpassword')
  async resetUserPassword(
    @Body() resetpassword: ResetPasswordDto,
    @Res() res: Response,
  ) {
    return this.userService.resetUserPassword(resetpassword, res);
  }
}
