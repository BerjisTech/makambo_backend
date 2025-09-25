import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 25;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.eventLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.eventLog.count()
    ]);

    return {
      page,
      limit,
      total,
      items
    };
  }
}
