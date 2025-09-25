import { SetMetadata } from '@nestjs/common';
import { PlayerRank } from '../player/dto/promote-player.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: PlayerRank[]) => SetMetadata(ROLES_KEY, roles);
