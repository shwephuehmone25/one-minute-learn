import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpStatus,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor, Query,
} from '@nestjs/common';
import PostsService from './posts.service';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import JwtAuthenticationGuard from '../authentication/guard/access-token.guard';
import { RolesGuard } from '../authentication/guard/role.guard';
import { Roles } from '../authentication/decorators/role.decorator';
import { Role } from 'src/authentication/enum/role.enum';
import FindOneParams from '../utils/findOneParams';
import RequestWithUser from '../authentication/requestWithUser.interface';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) { }

  //GET/ postSearch
  @Get()
  async getPosts(@Query('search') search: string) {
    try {
      if (search) {
        const searchResults = await this.postsService.searchForPosts(search);
        return {
          status: HttpStatus.OK,
          data: searchResults,
        };
      } else {
        const allPosts = await this.postsService.getAllPosts();
        return {
          status: HttpStatus.OK,
          data: allPosts,
        };
      }
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving posts',
        error: error.message,
      };
    }
  }

  //GET/ getPostsById
  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    try {
      const post = this.postsService.getPostById(Number(id));

      return {
        status: HttpStatus.OK,
        data: post,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Post not found or error retrieving post',
        error: error.message,
      };
    }
  }

  //POST/ createPost
  @Post()
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    try {
      const newPost = await this.postsService.createPost(post, req.user);

      return {
        status: HttpStatus.CREATED,
        message: 'Post is created successfully',
        data: newPost,
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Error creating post',
        error: error.message,
      };
    }
  }

  //PATCH/ updatePost
  @Patch(':id')
  async updatePost(@Param() { id }: FindOneParams, @Body() post: UpdatePostDto) {
    try {
      const updatedPost = await this.postsService.updatePost(Number(id), post);

      return {
        status: HttpStatus.OK,
        message: 'Post is updated successfully',
        data: updatedPost,
      };
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Post not found or error updating post',
        error: error.message,
      };
    }
  }

  //DELETE/ deletePost
  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    try {
      const deletedPost = await this.postsService.deletePost(Number(id));

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'Post is deleted successfully',
        data: deletedPost,
      };
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Post not found or error deleting post',
        error: error.message,
      };
    }
  }
}
