import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  getUsers(): Promise<User[]> {
    const users = this.userRepository.find({
      relations: ['posts', 'profile'],
      // relations: {
      //   profile: true,
      //   posts: true,
      // },
    });
    return users;
  }
  getUser(id: number): Promise<User> {
    const user = this.userRepository.findOne({ where: { id } });
    return user;
  }

  createUser(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  getUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  updateUser(id: number, user: UpdateUserDto): Promise<UpdateResult> {
    const updatedUser = this.userRepository.update({ id }, user);
    return updatedUser;
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    const profileCreated = await this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(profileCreated);
    user.profile = savedProfile;
    return this.userRepository.save(user);
  }
}
