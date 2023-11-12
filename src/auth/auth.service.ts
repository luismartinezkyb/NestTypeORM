import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-dto.dto';
import { RegisterDto } from './dto/register-dto.dto';
import { User } from 'src/users/users.entity';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser({ username, password }: LoginDto) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      username,
    };
    const token = await this.jwtService.signAsync(payload);
    return { username, token };
  }

  async registerUser({ username, password }: RegisterDto): Promise<User> {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      throw new BadRequestException('User already registered');
    }
    return await this.userService.createUser({
      username,
      password: await hash(password, 10),
    });
  }

  async getProfileByAuth(username: string) {
    return this.userService.getUserByUsername(username);
  }
}
