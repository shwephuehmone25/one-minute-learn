import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import PostEntity from './post.entity'; 

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  //GET /getAllPosts
  async getAllPosts(): Promise<PostEntity[]> {
    return this.postsRepository.find();
  }

  //GET /getPostById 
  async getPostById(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  //POST/ createPost
  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    const newPost = this.postsRepository.create(createPostDto);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  //PUT/ updatePost
  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    await this.postsRepository.update(id, updatePostDto);
    const updatedPost = await this.postsRepository.findOne({ where: { id } });
    if (!updatedPost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return updatedPost;
  }

  //DELETE/ deletePost
  async deletePost(id: number): Promise<void> {
    const deleteResult = await this.postsRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
