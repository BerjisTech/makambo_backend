import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateConflictDto } from './dto/create-conflict.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { WorldService } from './world.service';

@ApiTags('world')
@Controller('world')
export class WorldController {
  constructor(private readonly worldService: WorldService) {}

  @Get('state')
  getWorldState() {
    return this.worldService.getWorldState();
  }

  @Post('deposits')
  createDeposit(@Body() dto: CreateDepositDto) {
    return this.worldService.createDeposit(dto);
  }

  @Post('conflicts/:regionId')
  createConflict(@Param('regionId') regionId: string, @Body() dto: CreateConflictDto) {
    return this.worldService.startConflict(regionId, dto);
  }
}
