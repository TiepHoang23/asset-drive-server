import { Module } from '@nestjs/common';

import { DownloaderService } from './downloader.service';
import { DownloaderController } from './downloader.controller';
import { FreepikStrategy } from './strategies/freepik.strategy';

@Module({
  providers: [DownloaderService, FreepikStrategy],
  controllers: [DownloaderController],
})
export class DownloaderModule {}
