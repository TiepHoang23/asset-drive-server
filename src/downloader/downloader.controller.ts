import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DownloaderService } from './downloader.service';
import { Response } from 'express';

@Controller('downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Get('download')
  async downloadFile(
    @Query('url') url: string,
    @Query('strategyType') strategyType: string,
    @Res() res: Response,
  ) {
    if (!url || !strategyType) {
      throw new HttpException(
        'URL and strategyType query parameters are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const downloadedFile = await this.downloaderService.downloadFile(
        url,
        strategyType,
      );

      res.set({
        'Content-Disposition': `attachment; filename="${downloadedFile.filename}"`,
        'Content-Type': 'application/octet-stream',
      });

      return res.send(downloadedFile.getContents());
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
