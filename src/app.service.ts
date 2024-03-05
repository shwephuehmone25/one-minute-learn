import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getExampleData(name: string): string {
    return `Hello${name ? ' ' + name : ''}, this is your example data!`;
  }
}