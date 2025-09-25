import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PlayerRank } from '../player/dto/promote-player.dto';
import { LaunchMissileDto } from './dto/launch-missile.dto';
import { LaunchNukeDto } from './dto/launch-nuke.dto';
import { PlanOperationDto } from './dto/plan-operation.dto';
import { WarfareService } from './warfare.service';

@ApiTags('warfare')
@Controller('warfare')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarfareController {
  constructor(private readonly warfareService: WarfareService) {}

  @Post('operations')
  @Roles(PlayerRank.COMMANDER, PlayerRank.STRATEGIST)
  planOperation(@Body() dto: PlanOperationDto) {
    return this.warfareService.planOperation(dto);
  }

  @Post('missiles')
  @Roles(PlayerRank.COMMANDER, PlayerRank.STRATEGIST)
  launchMissile(@Body() dto: LaunchMissileDto) {
    return this.warfareService.launchMissile(dto);
  }

  @Post('nukes')
  @Roles(PlayerRank.STRATEGIST)
  launchNuke(@Body() dto: LaunchNukeDto) {
    return this.warfareService.launchNuke(dto);
  }
}
