import { IsString } from 'class-validator';

export class LaunchNukeDto {
  @IsString()
  warheadId!: string;

  @IsString()
  originCountryId!: string;

  @IsString()
  targetRegionId!: string;
}
