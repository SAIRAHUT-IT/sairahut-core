import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma';
import * as qrcode from 'qrcode';
import { RedeemCodeDto } from 'src/dtos/code-hunt-dto/redeem.dto';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
@Injectable()
export class CodeHuntService {
  constructor(private prismaService: PrismaService) {}

  private async generateQrcode(value: string) {
    const result = qrcode
      .toDataURL(value || 'SAIRAHUT_IT', {
        errorCorrectionLevel: 'H',
      })
      .then((url) => {
        return url;
      })
      .catch((err) => {
        console.error(err);
      });
    return await result;
  }

  private makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123356789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
      counter += 1;
    }
    return result;
  }

  public async generateCode(member: ValidateMemberDto) {
    try {
      const checker = await this.prismaService.code.count({
        where: {
          creator_id: member.id,
          disabled: false,
          is_used: false,
        },
      });
      if (checker >= 2) {
        await this.prismaService.code.updateMany({
          where: {
            creator_id: member.id,
            disabled: false,
            is_used: false,
          },
          data: { disabled: true },
        });
      }
      const creator = await this.prismaService.code.create({
        data: {
          creator_id: member.id,
          code: `${this.makeid(6)}$${member.id}`,
        },
      });
      const qrcode = await this.generateQrcode(creator.code);
      return {
        qrcode,
        meta: {
          creator_id: creator.creator_id,
          code: creator.code,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async redeemCode(
    body: RedeemCodeDto,
    member: ValidateMemberDto,
  ) {
    try {
      const codeInfo = await this.prismaService.code.findFirst({
        where: {
          code: body.code,
        },
      });
      if (!codeInfo) throw new NotFoundException('ไม่พบโค้ด');
      if (codeInfo.disabled || codeInfo.is_used)
        throw new BadRequestException(
          '(โค้ดนี้ถูกใช้งานแล้ว / โค้ดถูกสร้างขึ้นใหม่)',
        );

      const redeem = await this.prismaService.code.update({
        where: { id: codeInfo.id },
        data: { is_used: true, redeemed_by_id: member.id },
      });
      if (redeem.is_used) {
        return {
          message: `${redeem.redeemed_by_id} ได้ใช้โค้ดนี้แล้ว`,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
