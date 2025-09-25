import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Player } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface JwtPayload {
  sub: string;
  email: string;
  rank: string;
  countryId?: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  private signToken(player: Player) {
    const payload: JwtPayload = {
      sub: player.id,
      email: player.email,
      rank: player.rank,
      countryId: player.countryId
    };

    const expiresIn = this.configService.get<string>('jwt.expiresIn') ?? '1h';
    const accessToken = this.jwtService.sign(payload, {
      expiresIn
    });

    const { passwordHash: _passwordHash, ...safePlayer } = player;

    return {
      accessToken,
      player: safePlayer
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.player.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const country = await this.prisma.country.findUnique({ where: { id: dto.countryId } });
    if (!country) {
      throw new UnauthorizedException('Invalid country');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const player = await this.prisma.player.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash,
        countryId: dto.countryId
      }
    });

    return this.signToken(player);
  }

  async login(dto: LoginDto) {
    const player = await this.prisma.player.findUnique({ where: { email: dto.email } });
    if (!player) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, player.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(player);
  }
}
