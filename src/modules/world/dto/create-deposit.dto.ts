import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';

export enum DepositType {
  IRON = 'IRON',
  OIL = 'OIL',
  BAUXITE = 'BAUXITE',
  URANIUM = 'URANIUM',
  RARE_EARTH = 'RARE_EARTH'
}

class CoordinateDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}

export class CreateDepositDto {
  @IsEnum(DepositType)
  type!: DepositType;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  polygon!: CoordinateDto[];

  @IsString()
  countryId!: string;
}
