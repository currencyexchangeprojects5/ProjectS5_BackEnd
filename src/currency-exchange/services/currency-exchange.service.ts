import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../models/currency.entity';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CurrencyExchangeService implements OnModuleInit {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async onModuleInit() {
    await this.updateExchangeRates();
  }

  async getExchangeRate(
    sellCurrency: string,
    buyCurrency: string,
  ): Promise<number> {
    const exchangeRate = await this.currencyRepository.findOne({
      where: { sellCurrency, buyCurrency },
    });

    if (!exchangeRate) {
      throw new BadRequestException(
        'Invalid currency pair or unsupported currencies',
      );
    }

    return exchangeRate.rate;
  }

  private async updateExchangeRates() {
    try {
      const apiKey = process.env.API_KEY;

      if (!apiKey) {
        throw new BadRequestException('API Key is missing!');
      }

      const response = await axios.get(
        `https://data.fixer.io/api/latest?access_key=${apiKey}&symbols=USD,EUR,AMD,RUB`,
      );

      const { rates, base: baseCurrency } = response.data;

      if (!rates || !baseCurrency) {
        console.error('Invalid API response. Missing "rates" or "base" data.');
        return;
      }

      await this.saveExchangeRates(baseCurrency, rates);

      const savedRates = await this.currencyRepository.find();
    } catch (error) {
      console.error('Error fetching exchange rates:', error.message);
    }
  }

  private async saveExchangeRates(baseCurrency: string, rates: any) {
    if (rates[baseCurrency] === 0 || rates[baseCurrency] == null) {
      console.error(`Invalid base currency rate for ${baseCurrency}`);
      return;
    }

    if (!rates.USD || !rates.EUR || !rates.AMD || !rates.RUB) {
      console.error('Missing one or more exchange rates');
      return;
    }

    const currencyPairs = [
      {
        sellCurrency: baseCurrency,
        buyCurrency: 'USD',
        rate: rates.USD / rates[baseCurrency],
      },
      {
        sellCurrency: baseCurrency,
        buyCurrency: 'EUR',
        rate: rates.EUR / rates[baseCurrency],
      },
      {
        sellCurrency: baseCurrency,
        buyCurrency: 'AMD',
        rate: rates.AMD / rates[baseCurrency],
      },
      {
        sellCurrency: baseCurrency,
        buyCurrency: 'RUB',
        rate: rates.RUB / rates[baseCurrency],
      },
      {
        sellCurrency: 'USD',
        buyCurrency: baseCurrency,
        rate: rates[baseCurrency] / rates.USD,
      },
      {
        sellCurrency: 'EUR',
        buyCurrency: baseCurrency,
        rate: rates[baseCurrency] / rates.EUR,
      },
      {
        sellCurrency: 'AMD',
        buyCurrency: baseCurrency,
        rate: rates[baseCurrency] / rates.AMD,
      },
      {
        sellCurrency: 'RUB',
        buyCurrency: baseCurrency,
        rate: rates[baseCurrency] / rates.RUB,
      },
      {
        sellCurrency: 'USD',
        buyCurrency: 'EUR',
        rate: rates.EUR / rates.USD,
      },
      {
        sellCurrency: 'EUR',
        buyCurrency: 'USD',
        rate: rates.USD / rates.EUR,
      },
      {
        sellCurrency: 'USD',
        buyCurrency: 'AMD',
        rate: rates.AMD / rates.USD,
      },
      {
        sellCurrency: 'AMD',
        buyCurrency: 'USD',
        rate: rates.USD / rates.AMD,
      },
      {
        sellCurrency: 'USD',
        buyCurrency: 'RUB',
        rate: rates.RUB / rates.USD,
      },
      {
        sellCurrency: 'RUB',
        buyCurrency: 'USD',
        rate: rates.USD / rates.RUB,
      },
      {
        sellCurrency: 'EUR',
        buyCurrency: 'AMD',
        rate: rates.AMD / rates.EUR,
      },
      {
        sellCurrency: 'AMD',
        buyCurrency: 'EUR',
        rate: rates.EUR / rates.AMD,
      },
      {
        sellCurrency: 'EUR',
        buyCurrency: 'RUB',
        rate: rates.RUB / rates.EUR,
      },
      {
        sellCurrency: 'RUB',
        buyCurrency: 'EUR',
        rate: rates.EUR / rates.RUB,
      },
      {
        sellCurrency: 'AMD',
        buyCurrency: 'RUB',
        rate: rates.RUB / rates.AMD,
      },
      {
        sellCurrency: 'RUB',
        buyCurrency: 'AMD',
        rate: rates.AMD / rates.RUB,
      },
    ];

    for (const pair of currencyPairs) {
      const existingPair = await this.currencyRepository.findOne({
        where: {
          sellCurrency: pair.sellCurrency,
          buyCurrency: pair.buyCurrency,
        },
      });

      if (existingPair) {
        existingPair.rate = pair.rate;
        await this.currencyRepository.save(existingPair);
      } else {
        await this.currencyRepository.save(pair);
      }
    }
  }

  async convertCurrency(
    sell: string,
    buy: string,
    amount: number,
  ): Promise<any> {
    const rate = await this.getExchangeRate(sell, buy);

    const parsedRate = Math.round(rate * 10) / 10;

    if (parsedRate === 0) {
      return {
        sellCurrency: sell,
        buyCurrency: buy,
        amount: parseFloat(amount.toFixed(1)),
        total: 0,
        rate: parsedRate,
      };
    }
    const total = parseFloat((amount * parsedRate).toFixed(1));

    return {
      sellCurrency: sell,
      buyCurrency: buy,
      amount: parseFloat(amount.toFixed(1)),
      total,
      rate: parsedRate,
    };
  }

  async testDbConnection() {
    try {
      const result = await this.currencyRepository.find();
      console.log('Database connection successful. Current entries:', result);
    } catch (error) {
      console.error('Database connection error:', error.message);
    }
  }
}
