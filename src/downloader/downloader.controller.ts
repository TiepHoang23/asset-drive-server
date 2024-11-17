import {
  Controller,
  Res,
  HttpException,
  HttpStatus,
  Post,
  Body,
  // UseGuards,
} from '@nestjs/common';
import { DownloaderService } from './downloader.service';
import { Response } from 'express';
import { StrategyType } from 'src/common/utils/types';

@Controller('downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Post('download-file')
  // @UseGuards()
  async downloadFile(
    @Body() body: { url: string; strategyType: StrategyType },
    @Res() res: Response,
  ) {
    const { url, strategyType } = body;

    if (!url || !strategyType) {
      throw new HttpException(
        'URL and strategyType are required',
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

      return res.status(HttpStatus.OK).send({
        success: true,
        base64: downloadedFile.fileBase64,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('get-link-download')
  async getLinkDownload(
    @Body() body: { url: string; strategyType: StrategyType },
    @Res() res: Response,
  ) {
    const { url, strategyType } = body;

    if (!url || !strategyType) {
      throw new HttpException(
        'URL and strategyType are required in the request body',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const downloadLink = await this.downloaderService.getLink(
        url,
        strategyType,
      );

      return res.status(HttpStatus.OK).send({ success: true, downloadLink });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
