import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';

export enum OperationType {
  OFFENSIVE = 'OFFENSIVE',
  DEFENSIVE = 'DEFENSIVE',
  SABOTAGE = 'SABOTAGE'
}

class OperationUnitDto {
  @IsString()
  unitId!: string;

  @IsString()
  role!: string;
}

export class PlanOperationDto {
  @IsEnum(OperationType)
  type!: OperationType;

  @IsString()
  originCountryId!: string;

  @IsString()
  targetRegionId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OperationUnitDto)
  units!: OperationUnitDto[];
}
