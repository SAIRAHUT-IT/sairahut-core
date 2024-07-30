import { BadRequestException, Injectable } from '@nestjs/common';
import { MemberRole, MemberStatus } from '@prisma/client';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { ThisOrThatDto } from 'src/dtos/this-that/this-that.dto';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class ThisThatService {
  constructor(private prismaService: PrismaService) {}

  public async patchThisThat(
    body: ThisOrThatDto,
    member: ValidateMemberDto,
  ) {
    try {
      const checker = await this.prismaService.member.findFirst({
        where: { id: member.id },
      });
      if (checker.this_or_that.length > 0)
        throw new BadRequestException('คุณได้ทำแบบสำรวจไปแล้ว');
      await this.prismaService.member.update({
        where: {
          id: member.id,
          status: MemberStatus.UNPAIR,
        },
        data: {
          this_or_that: { push: body.payload },
        },
      });
      return {
        message: 'ทำแบบสำรวจสำเร็จ',
      };
    } catch (error) {
      throw error;
    }
  }
}
