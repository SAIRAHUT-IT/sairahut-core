import {
  BadRequestException,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import {
  GuessHopQuery,
  GuessPayloadDto,
} from 'src/dtos/guess/guess.dto';
import {
  CurrentHopType,
  HopType,
} from 'src/interfaces/hop.interface';
import { PrismaService } from 'src/libs/prisma';

@Injectable({ scope: Scope.DEFAULT })
export class GuessService {
  public hop_list: HopType;
  public hop_current: CurrentHopType;
  public current_hop: number;

  constructor(private prismaService: PrismaService) {
    this.hop_list = {
      NONE: [],
      FIRE: ['X9vLw7zT4b', 'H5mJr0xQ8c', 'A4vGd9yWqQ', 'D4zLx1tP7q'],
      EARTH: ['B3tPj2xL7k', 'Z8rFg4vL0M', 'U6vKm3rL0y', 'E7rXc3vL8b'],
      WATER: ['C7kLw9zJ1p', 'W3nQb2vR8h', 'V5jPz8xQ2b', 'H6xPq3rL9m'],
      LIGHTING: ['M9kLw1yR4p', 'R8tKj4vL2b', 'F7bQx2yL9t'],
      PLANT: ['J1vKz4rP8w', 'Q8cLw3nR7p', 'Y2rT5bK9xL', 'N6pQw1vJ7t'],
      AIR: ['T2qNw5pJ9x', 'L4zYk8bR1v', 'S5nLx1yQ7z', 'G3pWv6zR0k'],
    };
    this.hop_current = {
      FIRE: this.hop_list.FIRE[0],
      EARTH: this.hop_list.EARTH[0],
      WATER: this.hop_list.WATER[0],
      LIGHTING: this.hop_list.LIGHTING[0],
      PLANT: this.hop_list.PLANT[0],
      AIR: this.hop_list.AIR[0],
      NONE: this.hop_list.NONE[0],
    };
    this.current_hop = 0;
  }

  public findElementalByHop(hop: string): string | undefined {
    for (const [key, values] of Object.entries(this.hop_list)) {
      if ((values as string[]).includes(hop)) {
        return key;
      }
    }
  }

  public async validateHopper(
    { v }: GuessHopQuery,
    member_: ValidateMemberDto,
  ) {
    const member = await this.prismaService.member.findUnique({
      where: { id: member_.id },
      include: { paired_member: true },
    });

    if (!member) throw new BadRequestException('ไม่พบผู้ใช้');

    const elemental = member.paired_member?.elemental;
    const isSameElemental = this.hop_list[elemental].includes(v);

    const foundElemental = this.findElementalByHop(v);
    const foundElementalHop = this.hop_current[foundElemental];
    const isFake = foundElementalHop !== v;
    if (isFake) {
      return {
        type: 'fake',
      };
    }

    if (!isSameElemental && foundElementalHop === v) {
      return {
        type: 'not_matched',
      };
    }

    return {
      type: 'matched',
    };
  }

  public async validateSophomore(
    body: GuessPayloadDto,
    member_: ValidateMemberDto,
  ) {
    const member = await this.prismaService.member.findUnique({
      where: { id: member_.id },
      include: { paired_member: true },
    });

    if (!member) throw new BadRequestException('ไม่พบผู้ใช้');

    const soph = await this.prismaService.member.findFirst({
      where: { unique_key: body.guess },
      select: {
        id: true,
        real_nickname: true,
        role: true,
      },
    });

    if (!soph) throw new BadRequestException('ไม่พบจอมยุทธ์ท่านนี้');

    if (member.paired_member?.id !== soph.id)
      throw new BadRequestException('ไม่ใช่พี่คนนี่นะจ๊ะ');

    return {
      message: 'ถูกต้องครับ นีืคือจอมยุทธ์ของคุณ!',
      info: soph,
    };
  }
}
