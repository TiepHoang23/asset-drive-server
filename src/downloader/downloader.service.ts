import { Injectable, BadRequestException } from '@nestjs/common';
import { FreepikStrategy } from './strategies/freepik.strategy';

@Injectable()
export class DownloaderService {
  constructor(private readonly freepikStrategy: FreepikStrategy) {}

  async downloadFile(url: string, strategyType: string) {
    switch (strategyType.toLowerCase()) {
      case 'freepik':
        return this.freepikStrategy.downloadByUrl(url);
      default:
        throw new BadRequestException(
          `Unsupported strategy type: ${strategyType}`,
        );
    }
  }
}
