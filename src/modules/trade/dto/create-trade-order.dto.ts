import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsPositive, IsString } from 'class-validator';

export enum TradeOrderType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export class CreateTradeOrderDto {
  @IsString()
  resourceId!: string;

  @IsEnum(TradeOrderType)
  type!: TradeOrderType;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerUnit!: number;

  @IsString()
  countryId!: string;
}
