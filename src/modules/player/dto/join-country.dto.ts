import { IsEmail, IsString, MinLength } from 'class-validator';

export class JoinCountryDto {
  @IsEmail()
  email!: string;

  @IsString()
  displayName!: string;

  @IsString()
  countryId!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
