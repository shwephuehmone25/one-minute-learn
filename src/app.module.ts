import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './config/env.validation';
import { PostsModule } from './posts/posts.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { AuthModule } from './authentication/authentication.module';
import { User } from './users/user.entity';
import { PostEntity } from './posts/post.entity';
import { CategoriesModule } from './category/category.module';
import { UsersModule } from './users/users.module';
import Category from './category/category.entity';
import PublicFile from './files/publicFile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [PostEntity, User, Category, PublicFile],
        synchronize: true,
        logging: configService.get<boolean>('DB_LOGGING'),
      }),
    }),
    AuthModule,
    CategoriesModule,
    UsersModule
  ],
})
export class AppModule {}
