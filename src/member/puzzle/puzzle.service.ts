import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class PuzzleService {
  constructor(private prismaService: PrismaService) {}

  public async patchPuzzle(_member: ValidateMemberDto) {
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
          unlocked_puzzle: true,
        },
      });

      if (!member) throw new NotFoundException('ไม่พบผู้ใช้');
      const unlockedPuzzles = member.unlocked_puzzle as number[][];
      const availablePuzzle = puzzle.filter(
        (p) =>
          !unlockedPuzzles.some(
            (up) => up[0] === p[0] && up[1] === p[1],
          ),
      );

      if (availablePuzzle.length === 0)
        throw new BadRequestException('คุณได้ปลดล็อกครบทุกช่องแล้ว');

      const rand = Math.floor(Math.random() * availablePuzzle.length);
      const result = availablePuzzle[rand];

      await this.prismaService.member.update({
        where: {
          id: _member.id,
        },
        data: {
          unlocked_puzzle: [...unlockedPuzzles, result],
        },
      });

      return {
        message: `คุณได้ปลดล็อคช่องของ (คอลัมน์ที่ ${
          result[1] + 1
        }, แถวที่ ${result[0] + 1})`,
      };
    } catch (error) {
      throw error;
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
