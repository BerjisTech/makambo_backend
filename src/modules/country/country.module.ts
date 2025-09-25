import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [EventsModule],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService]
})
export class CountryModule {}
