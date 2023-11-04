import { Body, Controller, Get, Param, ParseIntPipe, Post as PostMethod } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Post } from './posts.entity';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @PostMethod()
  async createPost(@Body() post: CreatePostDto) {
    return await this.postService.createPost(post);
  }

  @Get()
  async getPosts(): Promise<Post[]> {
    return await this.postService.getPosts();
  }

  @Get('/user/:id')
  async getPostsByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Post[]> {
    const data = await this.postService.getPostsByUser(id);
    return data;
  }
}
