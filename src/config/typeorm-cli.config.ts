import { Category } from 'src/category/category.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { PostEntity } from 'src/posts/post.entity';
import { addPostTable20230324102000 } from 'src/migrations/20230324102000-add-post';
import User from '../users/user.entity';
import { addUser20230324101999 } from 'src/migrations/20230324101999-add-user';
import { addCategoryTable20230324103000 } from 'src/migrations/20230324103000-add-category';
//import { addFileTable20230324114000 } from '../migrations/20230324114000-add-file.save';
import { addUserIdToPosts20230324114001 } from '../migrations/20230324102900-add-userId-to-post';
import { addVideoTable20230324114001  } from 'src/migrations/20230324114001-add-video';
import PublicFile from 'src/files/publicFile.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  logging: configService.get<boolean>('DB_LOGGING'),
  entities: [PostEntity, User, Category, PublicFile],
  migrations: [
    addPostTable20230324102000,
    addUser20230324101999,
    addCategoryTable20230324103000,
    //addFileTable20230324114000,
    addVideoTable20230324114001,
    addUserIdToPosts20230324114001
  ],
});
