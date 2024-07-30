import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Member, MemberRole, MemberStatus } from '@prisma/client';
import * as QueryString from 'qs';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} from 'src/config/variables';
import {
  CallBackGoogleDto,
  ValidateMemberDto,
} from 'src/dtos/auth/auth.dto';
import {
  GoogleMemberInterface,
  GoogleTokenInterface,
} from 'src/interfaces/auth.interface';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}
  public async validateMember(body: ValidateMemberDto) {
    try {
      const member = await this.prismaService.member.findFirst({
        where: { id: body.id },
        include: {
          paired_member: {
            select: {
              elemental: true,
              hint: {
                where: { is_unlocked: true },
                select: { content: true },
                orderBy: {
                  id: 'asc',
                },
              },
            },
          },
          paired_with: true,
          redeemed_codes: true,
          created_codes:
            body.role === MemberRole.SOPHOMORE ||
            body.role === MemberRole.SENIOR
              ? true
              : false,
        },
      });

      if (!member) {
        throw new Error('Member not found');
      }

      const overall = await this.prismaService.member.findMany({
        where: { status: 'UNPAIR' },
        orderBy: { reputation: 'desc' },
      });

      const {
        elemental: pairedElemental,
        hint,
        ...pairedMemberDetails
      } = member.paired_member || {};
      const pairedMember = member.paired_member
        ? { ...pairedMemberDetails, elemental: pairedElemental }
        : null;

      return {
        ...member,
        elemental:
          !member.paired_member || member.role !== 'FRESHY'
            ? member.elemental
            : 'NONE',
        hint: hint?.map((e) => e.content),
        paired_member: pairedMember,
        ranking:
          overall.findIndex((e) => e.id === member.id) + 1 || 999,
      };
    } catch (error) {
      throw new Error(`Failed to validate member: ${error.message}`);
    }
  }

  public async googleCallbackLogin(
    callbackGoogleDto: CallBackGoogleDto,
  ) {
    try {
      const data = QueryString.stringify({
        code: callbackGoogleDto.code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
      });
      const tokenInfo: GoogleTokenInterface =
        await this.httpService.axiosRef
          .post('https://oauth2.googleapis.com/token', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((res) => res.data);
      if (tokenInfo) {
        const memberInfo: GoogleMemberInterface =
          await this.httpService.axiosRef
            .get(
              `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo.access_token}`,
              {
                headers: {
                  Authorization: `Bearer ${tokenInfo.access_token}`,
                },
              },
            )
            .then((res) => res.data);
        const member = await this.prismaService.member.findFirst({
          where: {
            username: `google:${memberInfo.id}`,
            email: memberInfo.email,
          },
        });
        if (member) {
          const payload = {
            id: member.id,
            username: member.username,
            role: member.role,
          };
          return {
            message: 'เข้าสู่ระบบสำเร็จ',
            access_token: this.jwtService.sign(payload),
          };
        } else {
          const role =
            memberInfo.email.slice(0, 3) === '660'
              ? MemberRole.SOPHOMORE
              : memberInfo.email.slice(0, 3) === '670'
              ? MemberRole.FRESHY
              : MemberRole.SENIOR;
          const is_major = memberInfo.email.slice(3, 5) === '70';
          if (!is_major)
            throw new BadRequestException("You're not in faculty");
          const checker = await this.prismaService.member.findFirst({
            where: {
              email: memberInfo.email,
              role: MemberRole.SOPHOMORE,
            },
          });
          if (role === MemberRole.SENIOR && !checker) {
            const result = await this.prismaService.member.create({
              data: {
                nickname: memberInfo.given_name,
                username: `google:${memberInfo.id}`,
                email: memberInfo.email,
                role: role,
                status: MemberStatus.FREEZE,
              },
            });
            const payload = {
              username: result.username,
              id: result.id,
              role: result.role,
            };
            return {
              message: 'เข้าสู่ระบบสำเร็จ',
              access_token: this.jwtService.sign(payload),
            };
          } else {
            const result = await this.prismaService.member.update({
              where: {
                email: memberInfo.email,
              },
              data: {
                nickname: memberInfo.given_name,
                username: `google:${memberInfo.id}`,
                email: memberInfo.email,
                role: role,
                status: MemberStatus.UNPAIR,
              },
            });
            const payload = {
              username: result.username,
              id: result.id,
              role: result.role,
            };
            return {
              message: 'เข้าสู่ระบบสำเร็จ',
              access_token: this.jwtService.sign(payload),
            };
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  public generateGoogleURL() {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile`;
  }
}
