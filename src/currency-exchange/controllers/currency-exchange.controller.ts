import { Controller, Post, Body } from '@nestjs/common';
import { CurrencyExchangeService } from '../services/currency-exchange.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConvertCurrencyRequestDto } from '../dtos/request/convert-currency-request.dto';
import { ConvertCurrencyResponseDto } from '../dtos/response/convert-currency-response.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('currency')
export class CurrencyExchangeController {
  constructor(
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  @Post('convert')
  @ApiOperation({ summary: 'Convert currency from one type to another' })
  @ApiResponse({
    status: 200,
    description: 'Currency conversion result',
    type: ConvertCurrencyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid currency pair or unsupported currencies',
  })
  @ApiBody({
    description: 'Currency conversion details',
    type: ConvertCurrencyRequestDto,
  })
  async convertCurrency(
    @Body() convertCurrencyRequestDto: ConvertCurrencyRequestDto,
  ): Promise<ConvertCurrencyResponseDto> {
    const { sellCurrency, buyCurrency, amount } = convertCurrencyRequestDto;

    return await this.currencyExchangeService.convertCurrency(
      sellCurrency,
      buyCurrency,
      amount,
    );
  }
}
