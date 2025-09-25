import { IsNumber, IsString } from 'class-validator';

export class LaunchMissileDto {
  @IsString()
  missileId!: string;

  @IsString()
  originCountryId!: string;

  @IsString()
  targetRegionId!: string;

  @IsNumber()
  flightTimeMinutes!: number;
}
