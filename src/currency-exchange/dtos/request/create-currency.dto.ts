import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  readonly sellCurrency: string;

  @IsString()
  @IsNotEmpty()
  readonly buyCurrency: string;

  @IsNumber()
  readonly amount: number;
}
