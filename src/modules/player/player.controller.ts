import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PlayerRank } from './dto/promote-player.dto';
import { JoinCountryDto } from './dto/join-country.dto';
import { PromotePlayerDto } from './dto/promote-player.dto';
import { PlayerService } from './player.service';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('join')
  joinCountry(@Body() dto: JoinCountryDto) {
    return this.playerService.joinCountry(dto);
  }

  @Post(':id/promote')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PlayerRank.STRATEGIST)
  promote(@Param('id') id: string, @Body() dto: PromotePlayerDto) {
    return this.playerService.promote(id, dto);
  }
}
