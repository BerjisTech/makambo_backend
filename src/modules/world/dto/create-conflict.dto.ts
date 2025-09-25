import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

class BattleParticipantDto {
  @IsString()
  countryId!: string;

  @IsString()
  objective!: string;
}

export enum ConflictType {
  BORDER = 'BORDER',
  RAID = 'RAID',
  SIEGE = 'SIEGE'
}

export class CreateConflictDto {
  @IsEnum(ConflictType)
  type!: ConflictType;

  @IsString()
  regionId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BattleParticipantDto)
  participants!: BattleParticipantDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
