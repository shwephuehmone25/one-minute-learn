import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Header,
  Headers,
  Res,
  HttpException, 
  HttpStatus
} from '@nestjs/common';
import { Express, Response } from 'express';
import LocalFilesInterceptor from '../utils/localFiles.interceptor';
import { VideosService } from './videos.service';
import FindOneParams from '../utils/findOneParams';

@Controller('videos')
export default class VideosController {
  constructor(private readonly videosService: VideosService) { }

  @Post()
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/videos',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('video')) {
          return callback(
            new BadRequestException('Provide a valid video'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )

  async addVideo(@UploadedFile() file: Express.Multer.File) {
    try {
      const video = await this.videosService.create({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      });
      return {
        status: HttpStatus.CREATED, // It's better to use the HttpStatus enum for status codes
        message: 'Video is uploaded successfully!',
        data: video,
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error uploading video.',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //GET/ streamVideo
  @Get(':id')
  @Header('Accept-Ranges', 'bytes')
  async streamVideo(
    @Param() params: FindOneParams,
    @Headers('range') range: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const id = parseInt(params.id, 10); 
    if (!range) {
      return this.videosService.getVideoStreamById(id);
    }
    const { streamableFile, contentRange } =
      await this.videosService.getPartialVideoStream(id, range);

    response.status(206);

    response.set({
      'Content-Range': contentRange,
    });

    return streamableFile;
  }
}