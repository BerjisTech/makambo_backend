import { IsEnum } from 'class-validator';

export enum PlayerRank {
  RECRUIT = 'RECRUIT',
  OPERATOR = 'OPERATOR',
  COMMANDER = 'COMMANDER',
  STRATEGIST = 'STRATEGIST'
}

export class PromotePlayerDto {
  @IsEnum(PlayerRank)
  rank!: PlayerRank;
}
