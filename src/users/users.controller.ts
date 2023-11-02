import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.getUser(id);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    const newUser = await this.usersService.getUserByUsername(user.username);
    if (newUser) {
      throw new BadRequestException('Username already in use');
    }
    return await this.usersService.createUser(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersService.deleteUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    const newUser = await this.usersService.getUser(id);
    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    if (user.username) {
      const userByUsername = await this.usersService.getUserByUsername(
        user.username,
      );
      if (userByUsername && userByUsername.id !== newUser.id) {
        throw new HttpException('username already in use', HttpStatus.CONFLICT);
      }
    }
    return this.usersService.updateUser(id, user);
  }

  @Post('/profile/:id')
  async createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfileDto,
  ) {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const profileCreated = await this.usersService.createProfile(id, profile);
    return profileCreated;
  }
}
