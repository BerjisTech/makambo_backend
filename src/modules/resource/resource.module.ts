import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [EventsModule],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService]
})
export class ResourceModule {}
