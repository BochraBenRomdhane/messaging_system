import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dialect = (config.get<string>('DB_DIALECT') || 'postgres') as any;
        const host = config.get<string>('DB_HOST');
        const portRaw = config.get<string>('DB_PORT');
        const username = config.get<string>('DB_USER');
        const password = config.get<string>('DB_PASSWORD');
        const database = config.get<string>('DB_NAME');

        if (!host || !portRaw || !username || !password || !database) {
          throw new Error('Database env vars missing. Required: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
        }

        return {
          dialect,
          host: String(host),
          port: Number(portRaw),
          username: String(username),
          password: String(password),
          database: String(database),
          autoLoadModels: true,
          synchronize: true,
          alter: true, // This will modify existing tables to match the model
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
