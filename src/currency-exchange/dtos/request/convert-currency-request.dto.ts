import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencyRequestDto {
  @ApiProperty({
    description: 'The currency to sell',
    example: 'USD',
  })
  sellCurrency: string;

  @ApiProperty({
    description: 'The currency to buy',
    example: 'AMD',
  })
  buyCurrency: string;

  @ApiProperty({
    description: 'The amount of currency to convert',
    example: 100,
  })
  amount: number;
}
