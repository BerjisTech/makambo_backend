import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PlayerRank } from '../player/dto/promote-player.dto';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityStatusDto } from './dto/update-facility-status.dto';
import { FacilityService } from './facility.service';

@ApiTags('facilities')
@Controller('facilities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(PlayerRank.COMMANDER, PlayerRank.STRATEGIST)
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post()
  create(@Body() dto: CreateFacilityDto) {
    return this.facilityService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateFacilityStatusDto) {
    return this.facilityService.updateStatus(id, dto);
  }

  @Get(':id/jobs')
  getJobs(@Param('id') id: string) {
    return this.facilityService.getJobs(id);
  }
}
