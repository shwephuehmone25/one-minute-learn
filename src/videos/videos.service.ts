import {
    BadRequestException,
    Injectable,
    NotFoundException,
    StreamableFile,
} from '@nestjs/common';
import { VideoDto } from './dto/video.dto';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';
import rangeParser from 'range-parser';
import { Video } from './video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VideosService {
    constructor(
        @InjectRepository(Video)
        private videosRepository: Repository<Video>,
    ) { }

    async create({ path, mimetype, filename }: VideoDto) {
        const video = this.videosRepository.create({ path, filename, mimetype });
        return await this.videosRepository.save(video);
    }

    async getVideoMetadata(id: number) {
        const videoMetadata = await this.videosRepository.findOne({
            where: {
                id,
            },
        });

        if (!videoMetadata) {
            throw new NotFoundException();
        }

        return videoMetadata;
    }

    parseRange(range: string, fileSize: number) {
        const parseResult = rangeParser(fileSize, range);
        if (parseResult === -1 || parseResult === -2 || parseResult.length !== 1) {
            throw new BadRequestException();
        }
        return parseResult[0];
    }

    async getFileSize(path: string) {
        const status = await stat(path);

        return status.size;
    }

    getContentRange(rangeStart: number, rangeEnd: number, fileSize: number) {
        return `bytes ${rangeStart}-${rangeEnd}/${fileSize}`;
    }

    async getPartialVideoStream(id: number, range: string) {
        const videoMetadata = await this.getVideoMetadata(id);
        const videoPath = join(process.cwd(), videoMetadata.path);
        const fileSize = await this.getFileSize(videoPath);

        const { start, end } = this.parseRange(range, fileSize);

        const stream = createReadStream(videoPath, { start, end });

        const streamableFile = new StreamableFile(stream, {
            disposition: `inline; filename="${videoMetadata.filename}"`,
            type: videoMetadata.mimetype,
        });

        const contentRange = this.getContentRange(start, end, fileSize);

        return {
            streamableFile,
            contentRange,
        };
    }

    async getVideoStreamById(id: number) {
        const videoMetadata = await this.getVideoMetadata(id);

        const stream = createReadStream(join(process.cwd(), videoMetadata.path));

        return new StreamableFile(stream, {
            disposition: `inline; filename="${videoMetadata.filename}"`,
            type: videoMetadata.mimetype,
        });
    }
}