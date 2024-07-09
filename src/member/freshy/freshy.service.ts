import { Injectable } from '@nestjs/common';
import { MemberRole, MemberStatus } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class FreshyService {
  constructor(private prismaService: PrismaService) {}

  public async getFreshies() {
    try {
      const result = await this.prismaService.member.findMany({
        where: {
          role: MemberRole.FRESHY,
        },
        include: {
          paired_member: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
