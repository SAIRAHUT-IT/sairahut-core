import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberStatus } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class PairerService {
  constructor(private prismaService: PrismaService) {}

  public async pairer() {
    try {
      const freshies = await this.prismaService.freshy.findMany({
        where: { status: MemberStatus.UNPAIR },
        include: { paired_member: true },
        orderBy: { id: 'asc' },
      });
      for (const std of freshies) {
        const sph = await this.prismaService.sophomore.findFirst({
          where: {
            status: MemberStatus.UNPAIR,
            this_or_that: { hasSome: std.this_or_that },
          },
          include: {
            paired_with: true,
            _count: { select: { paired_with: true } },
          },
        });
        if (!sph)
          throw new NotFoundException('มีปัญหาโปรดติดต่อเจ้าหน้าที่');
        const { self, target } = await this.connectMember(
          std.id,
          sph.id,
        );
        console.log(
          `Successfully Pair ${self.username} with ${target.username}`,
        );
        // return {
        //   message: `Successfully Pair ${self.username} with ${target.username}`,
        // };
      }
    } catch (error) {
      throw error;
    }
  }

  public async unpairer() {
    try {
      await this.prismaService.sophomore.updateMany({
        data: { status: MemberStatus.UNPAIR },
      });

      await this.prismaService.freshy.updateMany({
        data: {
          status: MemberStatus.UNPAIR,
          paired_member_id: null,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async connectMember(selfId: number, targetId: number) {
    const targetResult = await this.prismaService.sophomore.findFirst(
      {
        where: { id: targetId },
        include: {
          _count: { select: { paired_with: true } },
        },
      },
    );

    if (!targetResult) {
      throw new Error(
        `Sophomore member with id ${targetId} not found`,
      );
    }

    if (
      targetResult.maximum_member > targetResult._count.paired_with
    ) {
      const selfResponse = await this.prismaService.freshy.update({
        where: { id: selfId },
        data: {
          status: MemberStatus.PAIRED,
          paired_member: {
            connect: { id: targetResult.id },
          },
        },
      });

      const updatedTarget =
        await this.prismaService.sophomore.findFirst({
          where: { id: targetId },
          include: {
            _count: { select: { paired_with: true } },
          },
        });

      const targetResponse =
        await this.prismaService.sophomore.update({
          where: { id: targetResult.id },
          data: {
            status:
              updatedTarget.maximum_member >
              updatedTarget._count.paired_with
                ? MemberStatus.UNPAIR
                : MemberStatus.PAIRED,
          },
        });

      return { self: selfResponse, target: targetResponse };
    }
  }
}
