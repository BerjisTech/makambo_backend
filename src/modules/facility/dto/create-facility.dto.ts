import { ArrayNotEmpty, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum FacilityType {
  FURNACE = 'FURNACE',
  STEEL_MILL = 'STEEL_MILL',
  REFINERY = 'REFINERY',
  MACHINE_SHOP = 'MACHINE_SHOP',
  LAB = 'LAB'
}

export class CreateFacilityDto {
  @IsEnum(FacilityType)
  type!: FacilityType;

  @IsString()
  locationId!: string;

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  inputLotIds!: string[];
}
