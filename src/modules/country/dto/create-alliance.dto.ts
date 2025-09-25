import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateAllianceDto {
  @IsString()
  name!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  countryIds!: string[];

  @IsOptional()
  @IsString()
  charter?: string;
}
