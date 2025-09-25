import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFacilityDto, FacilityType } from './dto/create-facility.dto';
import { FacilityStatus, UpdateFacilityStatusDto } from './dto/update-facility-status.dto';

@Injectable()
export class FacilityService {
  constructor(private readonly prisma: PrismaService, private readonly eventsGateway: EventsGateway) {}

  async create(dto: CreateFacilityDto) {
    const facility = await this.prisma.facility.create({
      data: {
        type: dto.type ?? FacilityType.FURNACE,
        locationId: dto.locationId,
        status: FacilityStatus.UNDER_CONSTRUCTION,
        countryId: dto.countryId
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'facility.created', facilityId: facility.id });

    return {
      ...facility,
      inputLotIds: dto.inputLotIds,
      buildCompleteAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async updateStatus(id: string, dto: UpdateFacilityStatusDto) {
    const facility = await this.prisma.facility.update({
      where: { id },
      data: {
        status: dto.status
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'facility.updated', facilityId: facility.id });
    return facility;
  }

  async getJobs(id: string) {
    const facility = await this.prisma.facility.findUnique({
      where: { id },
      include: { jobs: true }
    });

    if (!facility) {
      throw new NotFoundException(`Facility ${id} not found`);
    }

    return {
      facilityId: id,
      jobs: facility.jobs
    };
  }
}
