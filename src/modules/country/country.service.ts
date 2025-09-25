import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAllianceDto } from './dto/create-alliance.dto';
import { PlantFlagDto } from './dto/plant-flag.dto';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService, private readonly eventsGateway: EventsGateway) {}

  findAll() {
    return this.prisma.country.findMany({
      include: {
        alliances: true,
        facilities: true,
        players: true,
        flags: true
      }
    });
  }

  async plantFlag(countryId: string, dto: PlantFlagDto) {
    const countryExists = await this.prisma.country.findUnique({ where: { id: countryId }, select: { id: true } });
    if (!countryExists) {
      throw new NotFoundException(`Country ${countryId} not found`);
    }

    const flag = await this.prisma.flag.create({
      data: {
        countryId,
        borderId: dto.borderId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: 'PENDING'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'flag.planted', flagId: flag.id });
    return flag;
  }

  async createAlliance(dto: CreateAllianceDto) {
    const countries = await this.prisma.country.findMany({
      where: { id: { in: dto.countryIds } },
      select: { id: true }
    });

    if (countries.length !== dto.countryIds.length) {
      throw new NotFoundException('One or more countries not found for alliance formation');
    }

    const alliance = await this.prisma.alliance.create({
      data: {
        name: dto.name,
        charter: dto.charter,
        countries: {
          connect: dto.countryIds.map((id) => ({ id }))
        }
      },
      include: {
        countries: true
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'alliance.created', allianceId: alliance.id });
    return alliance;
  }
}
