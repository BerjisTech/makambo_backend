import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PlayerRank } from '../player/dto/promote-player.dto';
import { CreateCraftJobDto } from './dto/create-craft-job.dto';
import { CreateMiningJobDto } from './dto/create-mining-job.dto';
import { ResourceService } from './resource.service';

@ApiTags('resources')
@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(PlayerRank.OPERATOR, PlayerRank.COMMANDER, PlayerRank.STRATEGIST)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post('mine')
  createMiningJob(@Body() dto: CreateMiningJobDto) {
    return this.resourceService.createMiningJob(dto);
  }

  @Post('craft')
  createCraftJob(@Body() dto: CreateCraftJobDto) {
    return this.resourceService.createCraftJob(dto);
  }

  @Get('inventory/:countryId')
  getInventory(@Param('countryId') countryId: string) {
    return this.resourceService.getInventory(countryId);
  }
}
