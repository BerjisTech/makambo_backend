import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorldModule } from './modules/world/world.module';
import { CountryModule } from './modules/country/country.module';
import { ResourceModule } from './modules/resource/resource.module';
import { FacilityModule } from './modules/facility/facility.module';
import { WarfareModule } from './modules/warfare/warfare.module';
import { TradeModule } from './modules/trade/trade.module';
import { PlayerModule } from './modules/player/player.module';
import { NotificationModule } from './modules/notification/notification.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    AuthModule,
    WorldModule,
    CountryModule,
    ResourceModule,
    FacilityModule,
    WarfareModule,
    TradeModule,
    PlayerModule,
    NotificationModule,
    EventsModule
  ]
})
export class AppModule {}
