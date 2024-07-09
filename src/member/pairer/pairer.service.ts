import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRole, MemberStatus } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class PairerService {
  constructor(private prismaService: PrismaService) {}

  public async pairer() {
    try {
      const freshies = await this.prismaService.member.findMany({
        where: {
          status: MemberStatus.UNPAIR,
          role: MemberRole.FRESHY,
        },
        include: { paired_member: true },
        orderBy: { id: 'asc' },
      });
      for (const std of freshies) {
        const sph = await this.prismaService.member.findFirst({
          where: {
            status: MemberStatus.UNPAIR,
            role: MemberRole.SOPHOMORE,
            this_or_that: { hasSome: std.this_or_that },
          },
          include: {
            paired_with: true,
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
        return {
          message: `Successfully Pair ${self.username} with ${target.username}`,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  public async connectMember(selfId: number, targetId: number) {
    const targetResult = await this.prismaService.member.findFirst({
      where: { id: targetId },
      include: {
        paired_with: true,
      },
    });

    if (!targetResult) {
      throw new Error(
        `Sophomore member with id ${targetId} not found`,
      );
    }

    if (
      targetResult.maximum_member > targetResult.paired_with.length
    ) {
      const selfResponse = await this.prismaService.member.update({
        where: { id: selfId, role: MemberRole.FRESHY },
        data: {
          status: MemberStatus.PAIRED,
          paired_member_id: targetResult.id,
        },
      });

      const updatedTarget = await this.prismaService.member.findFirst(
        {
          where: {
            id: targetId,
            role: MemberRole.SOPHOMORE,
          },
          include: {
            _count: { select: { paired_with: true } },
          },
        },
      );

      const targetResponse = await this.prismaService.member.update({
        where: { id: targetResult.id, role: MemberRole.SOPHOMORE },
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
