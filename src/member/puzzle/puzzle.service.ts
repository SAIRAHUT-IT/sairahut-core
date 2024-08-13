import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Mutex, MutexInterface } from 'async-mutex';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { PatchPuzzle } from 'src/dtos/puzzle/puzzle.dto';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class PuzzleService {
  private lock: Map<number, MutexInterface>;
  constructor(private prismaService: PrismaService) {
    this.lock = new Map();
  }

  public async patchPuzzle(
    body: PatchPuzzle,
    _member: ValidateMemberDto,
  ) {
    if (!this.lock.has(_member.id)) {
      this.lock.set(_member.id, new Mutex());
    }
    console.log(_member);
    console.log(this.lock.get(_member.id));

    const mutex = this.lock.get(_member.id);
    const release = await mutex.acquire();
    try {
      const puzzle = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];

      const member = await this.prismaService.member.findFirst({
        where: {
          id: _member.id,
        },
        select: {
          id: true,
          elemental: true,
          unlocked_puzzle: true,
          puzzle_count: true,
          puzzle_member_list: true,
          token: true,
        },
      });
      if (member.puzzle_member_list.includes(body.code))
        throw new BadRequestException(
          'คุณได้ปลดล็อคจอมยุทธ์คนนี้แล้ว',
        );
      const soph = await this.prismaService.member.findFirst({
        where: {
          unique_key: body.code,
        },
      });
      if (!soph)
        throw new BadRequestException('ไม่พบจอมยุทธ์ท่านนี้');
      if (member.puzzle_count === 3)
        throw new BadRequestException(
          'คุณได้ปลดล็อคครบ 3 ครั้งแล้วมาเปิดใหม่ในวันพรุ่งนี้นะ',
        );
      if (soph.elemental != member.elemental) {
        await this.prismaService.member.update({
          where: { id: member.id },
          data: {
            puzzle_member_list: {
              push: soph.unique_key,
            },
            puzzle_count: {
              increment: 1,
            },
          },
        });
        return {
          message: `เสียใจด้วยน้าา จอมยุทธ์ท่านนี้ไม่ใช้สำนักเดียวกัน`,
        };
      } else {
        if (!member) throw new NotFoundException('ไม่พบผู้ใช้');
        const unlockedPuzzles = member.unlocked_puzzle as number[][];
        const availablePuzzle = puzzle.filter(
          (p) =>
            !unlockedPuzzles.some(
              (up) => up[0] === p[0] && up[1] === p[1],
            ),
        );

        if (availablePuzzle.length === 0)
          throw new BadRequestException(
            'คุณได้ปลดล็อกครบทุกช่องแล้ว',
          );

        const rand = Math.floor(
          Math.random() * availablePuzzle.length,
        );
        const result = availablePuzzle[rand];

        await this.prismaService.member.update({
          where: {
            id: _member.id,
          },
          data: {
            puzzle_member_list: {
              push: soph.unique_key,
            },
            unlocked_puzzle: [...unlockedPuzzles, result],
            puzzle_count: {
              increment: 1,
            },
          },
        });

        return {
          message: `คุณได้ปลดล็อคช่องของ (คอลัมน์ที่ ${
            result[1] + 1
          }, แถวที่ ${result[0] + 1})`,
        };
      }
    } catch (error) {
      throw error;
    } finally {
      release();
    }
  }

  public async getPuzzle(_member: ValidateMemberDto) {
    try {
      const { unlocked_puzzle, id } =
        (await this.prismaService.member.findFirst({
          where: { id: _member.id },
          select: {
            id: true,
            unlocked_puzzle: true,
          },
        })) as { id: number; unlocked_puzzle: number[][] };
      return {
        id,
        unlocked_puzzle: unlocked_puzzle.sort((a, b) => {
          if (a[0] === b[0]) {
            return a[1] - b[1];
          } else {
            return a[0] - b[0];
          }
        }),
      };
    } catch (error) {
      throw error;
    }
  }
}
