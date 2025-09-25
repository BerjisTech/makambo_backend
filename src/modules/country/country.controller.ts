import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PlayerRank } from '../player/dto/promote-player.dto';
import { CreateAllianceDto } from './dto/create-alliance.dto';
import { PlantFlagDto } from './dto/plant-flag.dto';
import { CountryService } from './country.service';

@ApiTags('countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Post(':id/flags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PlayerRank.COMMANDER, PlayerRank.STRATEGIST)
  plantFlag(@Param('id') id: string, @Body() dto: PlantFlagDto) {
    return this.countryService.plantFlag(id, dto);
  }

  @Post('alliances')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PlayerRank.STRATEGIST)
  createAlliance(@Body() dto: CreateAllianceDto) {
    return this.countryService.createAlliance(dto);
  }
}
