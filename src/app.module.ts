import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyExchangeController } from './currency-exchange/controllers/currency-exchange.controller';
import { CurrencyExchangeService } from './currency-exchange/services/currency-exchange.service';
import { Currency } from './currency-exchange/models/currency.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Currency],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Currency]),
  ],
  controllers: [CurrencyExchangeController],
  providers: [CurrencyExchangeService],
})
export class AppModule {}
