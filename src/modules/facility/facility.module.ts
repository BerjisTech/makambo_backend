import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';

@Module({
  imports: [EventsModule],
  controllers: [FacilityController],
  providers: [FacilityService],
  exports: [FacilityService]
})
export class FacilityModule {}
