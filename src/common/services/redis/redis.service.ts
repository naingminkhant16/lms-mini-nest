import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    console.log('Redis module initialized');
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  async onModuleDestroy() {
    console.log('Redis module destroyed');
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }
}
