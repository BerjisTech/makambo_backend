import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { WarfareController } from './warfare.controller';
import { WarfareService } from './warfare.service';

@Module({
  imports: [EventsModule],
  controllers: [WarfareController],
  providers: [WarfareService],
  exports: [WarfareService]
})
export class WarfareModule {}
