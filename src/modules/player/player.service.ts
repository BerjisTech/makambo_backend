import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JoinCountryDto } from './dto/join-country.dto';
import { PromotePlayerDto } from './dto/promote-player.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async joinCountry(dto: JoinCountryDto) {
    const countryExists = await this.prisma.country.findUnique({ where: { id: dto.countryId }, select: { id: true } });
    if (!countryExists) {
      throw new NotFoundException(`Country ${dto.countryId} not found`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const player = await this.prisma.player.upsert({
      where: { email: dto.email },
      create: {
        email: dto.email,
        displayName: dto.displayName,
        countryId: dto.countryId,
        passwordHash
      },
      update: {
        displayName: dto.displayName,
        countryId: dto.countryId,
        passwordHash
      }
    });

    const { passwordHash: _passwordHash, ...safePlayer } = player;
    return safePlayer;
  }

  async promote(id: string, dto: PromotePlayerDto) {
    const player = await this.prisma.player.update({
      where: { id },
      data: {
        rank: dto.rank,
        updatedAt: new Date()
      }
    });

    const { passwordHash: _passwordHash, ...safePlayer } = player;
    return safePlayer;
  }
}
