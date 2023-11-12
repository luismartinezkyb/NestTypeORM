import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UsersService,
  ) {}
  //O PODEMOS USAR UNA INYECCION DE SERVICIO O INYECCION DE REPOSITORIO
  async createPost(post: CreatePostDto) {
    const user = await this.userService.getUser(post.authorId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const data = this.postRepository.create(post);

    const newPost = await this.postRepository.save(data);
    return newPost;
  }
  async getPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
    });
  }

  async getPostsByUser(id: number): Promise<Post[]> {
    return this.postRepository.find({ where: { authorId: id } });
  }
}
