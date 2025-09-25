import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

@Module({
  imports: [EventsModule],
  controllers: [TradeController],
  providers: [TradeService],
  exports: [TradeService]
})
export class TradeModule {}
