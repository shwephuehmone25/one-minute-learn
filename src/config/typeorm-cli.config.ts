import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import Post from 'src/posts/post.entity';
import { initialSchema1665490266140 } from 'src/migrations/1665490266140-initial-schema';
import User from '../users/user.entity';
import { addUser1666430321163 } from 'src/migrations/1666430321163-add-user';

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
  entities: [Post, User],
  migrations: [initialSchema1665490266140, addUser1666430321163],
});
