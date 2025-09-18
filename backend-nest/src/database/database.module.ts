import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
console.log('Database Module',process.env.DATABASE_URL);
@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        
        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is missing');
        }

        console.log('Database URL:', databaseUrl.replace(/\/\/.*@/, '//***:***@')); // Log URL without credentials

        return {
          uri: databaseUrl,
          autoLoadModels: true,
          synchronize: true,
          alter: true,
          pool: {
            max: 3,
            min: 0,
            acquire: 60000,
            idle: 10000,
            evict: 1000,
          },
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
            connectTimeout: 60000,
            requestTimeout: 60000,
          },
          retry: {
            max: 3,
            timeout: 60000,
          },
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
