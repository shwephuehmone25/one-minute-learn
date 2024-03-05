import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [],
  controllers: [AppController, MetricsController],
  providers: [AppService],
})
export class AppModule {}