import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencyResponseDto {
  @ApiProperty({
    description: 'The currency being sold',
    example: 'USD',
  })
  sellCurrency: string;

  @ApiProperty({
    description: 'The currency being bought',
    example: 'AMD',
  })
  buyCurrency: string;

  @ApiProperty({
    description: 'The original amount of money to convert',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    description: 'The result of the currency conversion',
    example: 84,
  })
  total: number;

  @ApiProperty({
    description: 'The exchange rate used for the conversion',
    example: 1.5,
  })
  rate: number;
}
