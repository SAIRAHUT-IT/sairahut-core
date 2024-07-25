import { Injectable } from '@nestjs/common';
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
      await this.prismaService.member.update({
        where: {
          id: member.id,
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
