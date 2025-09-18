import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Load environment variables from process.env and make ConfigService global
    NestConfigModule.forRoot({ isGlobal: true }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
