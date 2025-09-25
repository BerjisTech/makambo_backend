import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LaunchMissileDto } from './dto/launch-missile.dto';
import { LaunchNukeDto } from './dto/launch-nuke.dto';
import { PlanOperationDto } from './dto/plan-operation.dto';

@Injectable()
export class WarfareService {
  constructor(private readonly prisma: PrismaService, private readonly eventsGateway: EventsGateway) {}

  async planOperation(dto: PlanOperationDto) {
    const country = await this.prisma.country.findUnique({ where: { id: dto.originCountryId }, select: { id: true } });
    if (!country) {
      throw new NotFoundException(`Country ${dto.originCountryId} not found`);
    }

    const operation = await this.prisma.operation.create({
      data: {
        type: dto.type,
        originCountryId: dto.originCountryId,
        targetRegionId: dto.targetRegionId,
        units: dto.units,
        status: 'PLANNED'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'operation.planned', operationId: operation.id });
    return operation;
  }

  async launchMissile(dto: LaunchMissileDto) {
    const country = await this.prisma.country.findUnique({ where: { id: dto.originCountryId }, select: { id: true } });
    if (!country) {
      throw new NotFoundException(`Country ${dto.originCountryId} not found`);
    }

    const impactAt = new Date(Date.now() + dto.flightTimeMinutes * 60 * 1000);

    const strike = await this.prisma.missileStrike.create({
      data: {
        missileId: dto.missileId,
        originCountryId: dto.originCountryId,
        targetRegionId: dto.targetRegionId,
        flightTimeMinutes: dto.flightTimeMinutes,
        impactAt,
        status: 'IN_FLIGHT'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'missile.launched', strikeId: strike.id });
    return strike;
  }

  async launchNuke(dto: LaunchNukeDto) {
    const country = await this.prisma.country.findUnique({ where: { id: dto.originCountryId }, select: { id: true } });
    if (!country) {
      throw new NotFoundException(`Country ${dto.originCountryId} not found`);
    }

    const strike = await this.prisma.nuclearStrike.create({
      data: {
        warheadId: dto.warheadId,
        originCountryId: dto.originCountryId,
        targetRegionId: dto.targetRegionId,
        detonatedAt: new Date(),
        status: 'EXECUTED'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'nuke.detonated', strikeId: strike.id });
    return strike;
  }
}
