import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export enum ToolLevel {
  PRIMITIVE = 'PRIMITIVE',
  HAND_TOOL = 'HAND_TOOL',
  MECHANIZED = 'MECHANIZED',
  AUTOMATED = 'AUTOMATED'
}

export class CreateMiningJobDto {
  @IsString()
  depositId!: string;

  @IsEnum(ToolLevel)
  toolLevel!: ToolLevel;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  workers!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  durationHours!: number;
}
