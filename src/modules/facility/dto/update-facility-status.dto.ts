import { IsEnum } from 'class-validator';

export enum FacilityStatus {
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  ACTIVE = 'ACTIVE',
  DAMAGED = 'DAMAGED',
  DESTROYED = 'DESTROYED'
}

export class UpdateFacilityStatusDto {
  @IsEnum(FacilityStatus)
  status!: FacilityStatus;
}
