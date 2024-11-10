// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/database.config';

// Import các module khác
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DownloaderModule } from './downloader/downloader.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để các biến môi trường có thể truy cập toàn cục
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UsersModule,
    DownloaderModule,
  ],
})
export class AppModule {}
