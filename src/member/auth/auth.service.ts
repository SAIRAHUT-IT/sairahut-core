import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Member, MemberRole, MemberStatus } from '@prisma/client';
import { Mutex, MutexInterface } from 'async-mutex';
import * as QueryString from 'qs';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} from 'src/config/variables';
import {
  CallBackGoogleDto,
  PatchInfoDto,
  PatchNickNameDto,
  ValidateMemberDto,
} from 'src/dtos/auth/auth.dto';
import {
  GoogleMemberInterface,
  GoogleTokenInterface,
} from 'src/interfaces/auth.interface';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class AuthService {
  private lock: Map<number, MutexInterface>;
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {
    this.lock = new Map();
  }

  public async patchNickName(
    body: PatchNickNameDto,
    member: ValidateMemberDto,
  ) {
    try {
      if (body.nickname.length > 10 || body.nickname.length < 3)
        throw new BadRequestException(
          'ต้องตั้งชื่อมากกว่า 3 ตัวและน้อยกว่า 10 ตัว',
        );
      await this.prismaService.member.update({
        where: { id: member.id },
        data: { nickname: body.nickname },
      });
      return {
        message: 'เปลี่ยนชื่อเล่นสำเร็จ',
      };
    } catch (error) {
      throw error;
    }
  }

  public async patchInfo(
    body: PatchInfoDto,
    member: ValidateMemberDto,
  ) {
    try {
      await this.prismaService.member.update({
        where: { id: member.id },
        data: {
          real_nickname: body.real_nickname,
          contact: body.contact,
          branch: body.branch,
        },
      });
      return {
        message: 'อัพเดทข้อมูลสำเร็จ',
      };
    } catch (error) {
      throw error;
    }
  }

  public async validateMember(body: ValidateMemberDto) {
    try {
      const {
        puzzle_member_list,
        bingo_member_list,
        paired_member_id,
        ...member
      } = await this.prismaService.member.findFirst({
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
          ticket: true,
        },
      });

      if (!member) {
        throw new Error('Member not found');
      }
      const overall = await this.prismaService.member.findMany({
        where: { role: member.role },
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
            // username: `google:${memberInfo.id}`,
            status: { not: 'FREEZE' },
            email: memberInfo.email,
          },
        });
        if (member) {
          const payload = {
            id: member.id,
            username: member.username,
            role: member.role,
          };
          const updater_payload = {
            username: `google:${memberInfo.id}`,
            avatarURL: memberInfo.picture,
          };
          if (member.role == MemberRole.FRESHY) {
            Object.assign(updater_payload, {
              nickname: memberInfo.given_name,
            });
          }
          await this.prismaService.member.update({
            where: { id: member.id },
            data: { avatarURL: memberInfo.picture },
          });
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
                avatarURL: memberInfo.picture,
                email: memberInfo.email,
                role: role,
                status: MemberStatus.FORM,
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
            const update_payload = {
              username: `google:${memberInfo.id}`,
              avatarURL: memberInfo.picture,
              email: memberInfo.email,
              role:
                role == 'FRESHY'
                  ? MemberRole.FRESHY
                  : MemberRole.SOPHOMORE,
              status: MemberStatus.FORM,
            };
            if (role == 'FRESHY') {
              Object.assign(update_payload, {
                nickname: memberInfo.given_name,
              });
            }
            const result = await this.prismaService.member.update({
              where: {
                email: memberInfo.email,
              },
              data: update_payload,
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

  public async unlockHint(member: ValidateMemberDto) {
    if (!this.lock.has(member.id)) {
      this.lock.set(member.id, new Mutex());
    }

    const mutex = this.lock.get(member.id);
    const release = await mutex.acquire();

    try {
      const result = await this.prismaService.member.findFirst({
        where: { id: member.id },
        include: {
          paired_member: {
            select: {
              id: true,
              hint: {
                select: {
                  id: true,
                  content: true,
                  is_unlocked: true,
                },
                orderBy: { id: 'asc' },
              },
            },
          },
        },
      });
      if (!result.paired_member)
        throw new BadRequestException('ไม่พบเจ้าสำนัก');
      const hint = result.paired_member.hint;
      const unlocked_hint = hint.filter((e) => e.is_unlocked);
      const locked_hint = hint.filter((e) => !e.is_unlocked);
      if (locked_hint.length <= 0) {
        throw new BadRequestException('คำใบ้ปลดล็อคครบแล้ว');
      }
      // if (!(await this.checkHintPhase(unlocked_hint.length + 1)))
      //   throw new BadRequestException(
      //     'วันนี้ไม่สามารถปลดล็อคคำใบ้เพิ่มได้',
      //   );
      const selected_hint = locked_hint[0];
      const price = await this.checkPrice(unlocked_hint.length + 1);
      if (result.token < price)
        throw new BadRequestException('Chakras ไม่เพียงพอ');
      if (result.token >= price) {
        await this.prismaService.hint.update({
          where: {
            id: selected_hint.id,
            member_id: result.paired_member.id,
          },
          data: { is_unlocked: true },
        });
        await this.prismaService.member.update({
          where: { id: member.id },
          data: {
            token: {
              decrement: price,
            },
          },
        });
        return {
          message: `ปลดล็อคคำใบ้ที่ ${
            unlocked_hint.length + 1
          } สำเร็จ`,
        };
      }
    } catch (error) {
      throw error;
    } finally {
      release();
    }
  }

  private async checkHintPhase(next: number) {
    const phase = {
      8: [1],
      9: [1, 2],
      10: [1, 2, 3],
      11: [1, 2, 3, 4],
      12: [1, 2, 3, 4, 5, 6],
      13: [1, 2, 3, 4, 5, 6, 7],
    };
    const day = new Date().getDate();
    if (!phase[day]) return false;
    if (day > 13) return true;
    const phase_range = day > 13 ? [1, 2, 3, 4, 5, 6, 7] : phase[day];
    const valid = phase_range.includes(next);
    if (!valid) return false;
    return true;
  }

  private async checkPrice(next: number) {
    const price = {
      1: 5,
      2: 5,
      3: 10,
      4: 10,
      5: 15,
      6: 20,
      7: 25,
    };
    return price[next];
  }

  public generateGoogleURL() {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile`;
  }
}
