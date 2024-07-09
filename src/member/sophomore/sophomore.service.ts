import { Injectable } from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class SophomoreService {
  constructor(private prismaService: PrismaService) {}

  public async getSophomoreId(id: number) {
    try {
      const result = await this.prismaService.member.findUnique({
        where: { id: id, role: MemberRole.SOPHOMORE },
        include: {
          paired_with: true,
        },
      });
      return result;
    } catch (error) {}
  }

  public async getSophomore() {
    try {
      const result = await this.prismaService.member.findMany({
        where: {
          role: MemberRole.SOPHOMORE,
        },
        include: {
          paired_with: true,
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
