import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCraftJobDto } from './dto/create-craft-job.dto';
import { CreateMiningJobDto } from './dto/create-mining-job.dto';

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService, private readonly eventsGateway: EventsGateway) {}

  async createMiningJob(dto: CreateMiningJobDto) {
    const deposit = await this.prisma.resourceDeposit.findUnique({
      where: { id: dto.depositId },
      select: { id: true }
    });

    if (!deposit) {
      throw new NotFoundException(`Deposit ${dto.depositId} not found`);
    }

    const durationHours = Math.max(1, Math.ceil(dto.durationHours));

    const job = await this.prisma.miningJob.create({
      data: {
        depositId: dto.depositId,
        toolLevel: dto.toolLevel,
        workers: dto.workers,
        duration: durationHours,
        status: 'QUEUED'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'mining.job.created', jobId: job.id });

    return {
      ...job,
      eta: new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
    };
  }

  async createCraftJob(dto: CreateCraftJobDto) {
    const facility = await this.prisma.facility.findUnique({
      where: { id: dto.facilityId },
      select: { id: true }
    });

    if (!facility) {
      throw new NotFoundException(`Facility ${dto.facilityId} not found`);
    }

    const job = await this.prisma.facilityJob.create({
      data: {
        facilityId: dto.facilityId,
        recipeId: dto.recipeId,
        inputs: dto.inputs,
        status: 'QUEUED'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'facility.job.created', jobId: job.id });
    return job;
  }

  async getInventory(countryId: string) {
    const country = await this.prisma.country.findUnique({ where: { id: countryId }, select: { id: true } });
    if (!country) {
      throw new NotFoundException(`Country ${countryId} not found`);
    }

    const lots = await this.prisma.inventoryLot.findMany({
      where: { countryId },
      orderBy: { createdAt: 'desc' }
    });

    return {
      countryId,
      lots
    };
  }
}
