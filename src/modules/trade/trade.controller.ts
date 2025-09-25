import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTradeOrderDto } from './dto/create-trade-order.dto';
import { TradeService } from './trade.service';

@ApiTags('trade')
@Controller('trade')
@UseGuards(JwtAuthGuard)
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('orders')
  createOrder(@Body() dto: CreateTradeOrderDto) {
    return this.tradeService.createOrder(dto);
  }

  @Get('orders/:id')
  findOrder(@Param('id') id: string) {
    return this.tradeService.findOrder(id);
  }

  @Get('routes/:countryId')
  findRoutes(@Param('countryId') countryId: string) {
    return this.tradeService.findRoutes(countryId);
  }
}
