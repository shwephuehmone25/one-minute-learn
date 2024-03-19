import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './video.entity';
import VideosController from './videos.controllers';

@Module({
    imports: [TypeOrmModule.forFeature([Video])],
    controllers: [VideosController],
    providers: [VideosService],
    exports: [VideosService],
})
export class VideosModule {}
