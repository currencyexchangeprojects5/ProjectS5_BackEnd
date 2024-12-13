import { Module } from '@nestjs/common';
import { CurrencyExchangeController } from './controllers/currency-exchange.controller';
import { CurrencyExchangeService } from './services/currency-exchange.service';

@Module({
  controllers: [CurrencyExchangeController],
  providers: [CurrencyExchangeService],
})
export class CurrencyExchangeModule {}
