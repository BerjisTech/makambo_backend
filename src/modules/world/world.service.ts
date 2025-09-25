import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateConflictDto } from './dto/create-conflict.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class WorldService {
  constructor(private readonly prisma: PrismaService, private readonly eventsGateway: EventsGateway) {}

  async getWorldState() {
    const [deposits, conflicts, facilities, tradeOrders, flags] = await Promise.all([
      this.prisma.resourceDeposit.findMany({}),
      this.prisma.conflict.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.facility.findMany({}),
      this.prisma.tradeOrder.findMany({ where: { status: 'OPEN' }, orderBy: { createdAt: 'desc' } }),
      this.prisma.flag.findMany({})
    ]);

    return {
      terrainLayer: 'BASE_TERRAIN',
      deposits,
      conflicts,
      facilities,
      tradeOrders,
      borders: flags,
      tradeRoutes: []
    };
  }

  async createDeposit(dto: CreateDepositDto) {
    const countryExists = await this.prisma.country.findUnique({ where: { id: dto.countryId }, select: { id: true } });
    if (!countryExists) {
      throw new NotFoundException(`Country ${dto.countryId} not found`);
    }

    const data: Prisma.ResourceDepositCreateInput = {
      type: dto.type,
      polygon: dto.polygon,
      remaining: 1,
      country: {
        connect: {
          id: dto.countryId
        }
      }
    };

    const deposit = await this.prisma.resourceDeposit.create({ data });
    this.eventsGateway.broadcast('world.update', { kind: 'deposit.created', depositId: deposit.id });
    return deposit;
  }

  async startConflict(regionId: string, dto: CreateConflictDto) {
    const conflict = await this.prisma.conflict.create({
      data: {
        type: dto.type,
        regionId: dto.regionId ?? regionId,
        notes: dto.notes,
        participants: dto.participants,
        status: 'PENDING'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'conflict.started', conflictId: conflict.id });
    return conflict;
  }
}
