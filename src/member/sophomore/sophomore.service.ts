import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class SophomoreService {
  constructor(private prismaService: PrismaService) {}

  public async getSophomoreId(id: number) {
    try {
      const result = await this.prismaService.sophomore.findUnique({
        where: { id: id },
        include: {
          paired_with: true,
        },
      });
      return result;
    } catch (error) {}
  }

  public async getSophomore() {
    try {
      const result = await this.prismaService.sophomore.findMany({
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
