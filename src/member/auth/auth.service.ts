import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberRole } from '@prisma/client';
import * as QueryString from 'qs';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
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
      const result = await this.prismaService.member.findFirst({
        where: { id: body.id },
        include: {
          code: true,
          paired_member: true,
          paired_with: true,
        },
      });
      return result;
    } catch (error) {
      throw error;
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
        redirect_uri:
          'https://c8b7-49-228-18-45.ngrok-free.app/auth/callback',
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
            member.email.slice(0, 3) === '660'
              ? MemberRole.SOPHOMORE
              : member.email.slice(0, 3) === '670'
              ? MemberRole.FRESHY
              : MemberRole.SENIOR;
          const is_major = member.email.slice(3, 5) === '70';
          if (!is_major)
            throw new BadRequestException("You're not in faculty");
          const result = await this.prismaService.member.create({
            data: {
              username: `google:${memberInfo.id}`,
              email: memberInfo.email,
              role: role,
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
    } catch (error) {
      throw error;
    }
  }

  public generateGoogleURL() {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${'https://c8b7-49-228-18-45.ngrok-free.app/auth/callback'}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile`;
  }
}
