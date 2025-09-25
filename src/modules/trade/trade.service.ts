import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTradeOrderDto } from './dto/create-trade-order.dto';

@Injectable()
export class TradeService {
  constructor(private readonly prisma: PrismaService, private readonly eventsGateway: EventsGateway) {}

  async createOrder(dto: CreateTradeOrderDto) {
    const countryExists = await this.prisma.country.findUnique({ where: { id: dto.countryId }, select: { id: true } });
    if (!countryExists) {
      throw new NotFoundException(`Country ${dto.countryId} not found`);
    }

    const order = await this.prisma.tradeOrder.create({
      data: {
        resourceId: dto.resourceId,
        type: dto.type,
        quantity: dto.quantity,
        pricePerUnit: dto.pricePerUnit,
        countryId: dto.countryId,
        status: 'OPEN'
      }
    });

    this.eventsGateway.broadcast('world.update', { kind: 'trade.order.created', orderId: order.id });
    return order;
  }

  findOrder(id: string) {
    return this.prisma.tradeOrder.findUnique({ where: { id } });
  }

  async findRoutes(countryId: string) {
    const orders = await this.prisma.tradeOrder.findMany({
      where: { countryId },
      orderBy: { createdAt: 'desc' }
    });

    return {
      countryId,
      openOrders: orders
    };
  }
}
