import { IsNumber, IsString } from 'class-validator';

export class PlantFlagDto {
  @IsString()
  borderId!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}
