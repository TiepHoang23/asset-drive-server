import { join } from 'path';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { readFileSync, unlinkSync, createWriteStream } from 'fs';
import axios from 'src/common/interceptors/axios.util';
import { checkAndRefreshCookie } from 'src/common/utils/cookie.util';

@Injectable()
export class FreepikStrategy {
  private readonly idPattern = /\d+?(?=\.htm)/;
  private readonly downloadDir = join(__dirname, '../../download/');

  async downloadByUrl(url: string): Promise<DownloadedFile> {
    const fileId = this.extractFileId(url);
    const fileFormat = this.determineFileFormat(url);

    await checkAndRefreshCookie(url);
    const downloadUrl = this.buildDownloadUrl(fileId);
    const filePath = await this.fetchAndSaveFile(
      downloadUrl,
      fileId,
      fileFormat,
    );

    return new DownloadedFile(filePath, `${fileId}${fileFormat}`);
  }

  private extractFileId(url: string): string {
    const urlObject = new URL(url);
    const [fileId] = urlObject.pathname.match(this.idPattern) || [];

    if (!fileId) {
      throw new BadRequestException('Invalid URL: File ID not found');
    }
    return fileId;
  }

  private determineFileFormat(url: string): string {
    return url.includes('/photo/') ? '.jpg' : '.zip';
  }

  private buildDownloadUrl(fileId: string): string {
    return `https://www.freepik.com/download-file/${fileId}`;
  }

  private async fetchAndSaveFile(
    downloadUrl: string,
    fileId: string,
    fileFormat: string,
  ): Promise<string> {
    try {
      const response = await axios.get(downloadUrl, { responseType: 'stream' });
      const filePath = join(this.downloadDir, `${fileId}${fileFormat}`);
      await this.saveFile(response.data, filePath);
      return filePath;
    } catch (error) {
      throw new InternalServerErrorException('Failed to download file');
    }
  }

  private saveFile(dataStream, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writer = createWriteStream(filePath);
      dataStream.pipe(writer);

      writer.on('finish', resolve);
      writer.on('error', (error) => {
        unlinkSync(filePath);
        reject(new InternalServerErrorException('Failed to save file'));
      });
    });
  }
}

export class DownloadedFile {
  constructor(
    public readonly path: string,
    public readonly filename: string,
  ) {}

  delete(): void {
    unlinkSync(this.path);
  }

  getContents(): Buffer {
    return readFileSync(this.path);
  }
}
