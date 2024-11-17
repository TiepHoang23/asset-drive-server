import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import axios from 'src/common/interceptors/axios.interceptor';
import { checkAndRefreshCookie } from 'src/common/utils/cookie.util';

@Injectable()
export class FreepikStrategy {
  private readonly idPattern = /\d+?(?=\.htm)/;

  public async downloadByUrl(
    url: string,
  ): Promise<{ filename: string; fileBase64: string }> {
    const fileId = this.extractFileId(url);

    const downloadUrl = this.buildDownloadUrl(fileId);
    await checkAndRefreshCookie(downloadUrl);
    const file = await this.getFileBase64(downloadUrl);

    if (!file) {
      throw new InternalServerErrorException('Failed to download file');
    }

    return file;
  }

  public async getLinkDownload(url: string): Promise<string> {
    const fileId = this.extractFileId(url);
    const downloadUrl = this.buildDownloadUrl(fileId);
    await checkAndRefreshCookie(downloadUrl);

    return downloadUrl;
  }

  private extractFileId(url: string): string {
    const urlObject = new URL(url);
    const [fileId] = urlObject.pathname.match(this.idPattern) || [];

    if (!fileId) {
      throw new BadRequestException('Invalid URL: File ID not found');
    }
    return fileId;
  }

  private buildDownloadUrl(fileId: string): string {
    return `https://www.freepik.com/download-file/${fileId}`;
  }

  private async getFileBase64(downloadUrl: string): Promise<{
    filename: string;
    fileBase64: string;
  }> {
    try {
      const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
      });

      const fileName =
        response.headers['content-disposition']?.split('filename=')?.[1] || '';
      return {
        filename: fileName,
        fileBase64: Buffer.from(response.data).toString('base64'),
      };
    } catch (error) {
      return;
    }
  }
}
