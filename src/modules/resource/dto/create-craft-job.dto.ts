import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsString, Min, ValidateNested } from 'class-validator';

class RecipeInputDto {
  @IsString()
  lotId!: string;

  @Type(() => Number)
  @Min(0.1)
  quantity!: number;
}

export class CreateCraftJobDto {
  @IsString()
  facilityId!: string;

  @IsString()
  recipeId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RecipeInputDto)
  inputs!: RecipeInputDto[];
}
