import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto.dto';
import { RegisterDto } from './dto/register-dto.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request as RequestHttp } from 'express';

export interface RequestDto extends RequestHttp {
  user_token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registerUser(registerDto);
  }

  @Get('/user/:username')
  @UseGuards(AuthGuard)
  async findUser(
    @Param('username') username: string,
    @Request() req: RequestHttp,
  ) {
    console.log(req);
    const user = await this.authService.getProfileByAuth(username);
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    return user;
  }
}
