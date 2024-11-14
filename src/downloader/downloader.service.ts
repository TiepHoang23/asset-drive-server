import { Injectable, BadRequestException } from '@nestjs/common';
import { FreepikStrategy } from './strategies/freepik.strategy';
import { StrategyType } from 'src/common/utils/types';

@Injectable()
export class DownloaderService {
  private strategyMap: { [key in StrategyType]: FreepikStrategy };

  constructor(private readonly freepikStrategy: FreepikStrategy) {
    this.strategyMap = {
      [StrategyType.Freepik]: freepikStrategy,
    };
  }

  private getStrategy(strategyType: StrategyType) {
    const strategy = this.strategyMap[strategyType];
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported strategy type: ${strategyType}`,
      );
    }
    return strategy;
  }

  async downloadFile(url: string, strategyType: StrategyType) {
    const strategy = this.getStrategy(strategyType);
    return strategy.downloadByUrl(url);
  }

  async getLink(url: string, strategyType: StrategyType) {
    const strategy = this.getStrategy(strategyType);
    return strategy.getLinkDownload(url);
  }
}
