import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import {
  QuestionDto,
  BingoPayloadDto,
  PrizeObject,
  PatchTicketDto,
} from 'src/dtos/bingo/bingo.dto';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class BingoService {
  private bingoPayload: QuestionDto[];
  private prize: PrizeObject;
  constructor(private prismaService: PrismaService) {
    this.bingoPayload = [
      { question: 'ไปคาราโอเกะ', is_checked: false },
      { question: 'เต้น TikTok', is_checked: false },
      { question: 'ทำอาหาร', is_checked: false },
      { question: 'กินข้าวที่บิลเลี่ยน', is_checked: false },
      { question: 'ดูซีรีย์ข้ามคืน', is_checked: false },
      { question: 'มาเรียนสาย', is_checked: false },
      { question: 'เข้ายิมที่คณะ', is_checked: false },
      { question: 'ใช้ลิฟท์ขึ้นชั้น 2', is_checked: false },
      { question: 'หลับในห้องเรียน', is_checked: false },
      { question: 'ด้นสด present', is_checked: false },
      { question: 'ไปโรงหนังคนเดียว', is_checked: false },
      { question: 'จดสรุปก่อนสอบ', is_checked: false },
      { question: 'เล่นกับแมวที่ไม่รู้จัก', is_checked: false },
      { question: 'ปิดตาดูหนังผี', is_checked: false },
      { question: 'ไปโรบินสันลาดกระบััง', is_checked: false },
      { question: 'ดูดน้ำหลอดเดียวกับเพื่อน', is_checked: false },
    ] satisfies typeof this.bingoPayload;
    this.prize = {
      5: [
        'ยินดีด้วย ! คุณได้สิทธิ์ขอ IG พี่คนไหนก็ได้ 1 คน (ถ้าพี่เขายอมให้นะ🙂‍↕️)',
        'แจ็คพอตแตก ! คุณได้รับรางวัลสุดพิเศษ รอติดตามได้ในวันที่ 17 ส.ค.',
      ],
      35: [
        'ยินดีด้วย ! คุณได้สิทธิ์แปะมือกับพี่รหัส 1 ครั้ง',
        'ยินดีด้วย ! คุณได้สิทธิ์ยักคิ้วใส่พี่รหัส 1 ครั้ง',
        'ยินดีด้วย ! คุณได้สิทธิ์ขยิบตาใส่พี่รหัส 1 ครั้ง',
        'ยินดีด้วย ! คุณได้สิทธิ์ถามชื่อกับพี่รหัส 1 ครั้ง',
        'ยินดีด้วย ! คุณได้รับยักไหล่ใส่พี่รหัส',
      ],
      60: [
        'ยินดีด้วย ! คุณได้รับคำอวยพรจากพี่ ๆ IT21 ขอให้มีความสุขในการเรียนทุกวิชานะ🍀',
        'ยินดีด้วย ! คุณได้สิทธิ์ Shake hands กับพี่รหัส 1 ครั้ง',
        'ยินดีด้วย ! คุณได้สิทธิ์ท้าพี่รหัสเป่ายิ้งฉุบ 1 ครั้ง',
        'ยินดีด้วย ! คุณได้รับสิทธิ์ถ่าย IG Story กับพี่รหัส 1 ครั้ง',
        'ยินดีด้วย ! คุณได้รับสิทธิ์เซลฟี่กับพี่รหัส 1 ครั้ง',
        'ยินดีด้วย ! นี่คือ IG : smo.itkmitl ของสโมสรคณะไอที !',
        'ยินดีด้วย ! นี่คือ IG : agape_kmitl ของชุมนุมอากาเป้ !',
        'ยินดีด้วย ! นี่คือ IG : itkmitl.photoclub ของชุมนุมโฟโต้ !',
      ],
    } satisfies typeof this.prize;
  }

  private split_chunk = (val: any) => {
    const chunkSize = 4;
    const bingoPayload = [];

    for (let i = 0; i < val.length; i += chunkSize) {
      const chunk = val.slice(i, i + chunkSize);
      bingoPayload.push(chunk);
    }
    return bingoPayload;
  };

  private shuffleArray = (array: any) => {
    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  };
  private randomPrize(): string {
    const ranges = [];

    let cumulativePercentage = 0;
    for (const [percentage, values] of Object.entries(this.prize)) {
      const numericPercentage = parseFloat(percentage);
      cumulativePercentage += numericPercentage;
      ranges.push({ max: cumulativePercentage, values });
    }

    const randomValue = Math.random() * 100;

    for (const range of ranges) {
      if (randomValue < range.max) {
        const randomIndex = Math.floor(
          Math.random() * range.values.length,
        );
        return range.values[randomIndex];
      }
    }
    return null;
  }

  private generatePrize(amount: number): { title: string }[] {
    const prizes = [];
    for (let i = 0; i < amount; i++) {
      prizes.push(this.randomPrize());
    }
    console.log(prizes.map((e) => ({ title: e })));
    return prizes.map((e) => ({ title: e }));
  }

  public async unlockBingoSlot(
    payload: BingoPayloadDto,
    member_: ValidateMemberDto,
  ) {
    try {
      const member = await this.prismaService.member.findUnique({
        where: { id: member_.id },
      });
      if (!member) {
        throw new BadRequestException('ไม่พบผู้ใช้');
      }

      if (!member.bingo_board) {
        throw new BadRequestException('กรุณาติดต่อเจ้าหน้าที่');
      }

      if (member.bingo_member_list.includes(payload.key))
        throw new BadRequestException(
          'ไม่สามารถปลดล็อคจากพี่คนเดิมได้',
        );

      const splitted_board = this.split_chunk(member.bingo_board);
      if (
        payload.row < 0 ||
        payload.row >= splitted_board.length ||
        payload.column < 0 ||
        payload.column >= splitted_board[payload.row].length
      ) {
        throw new BadRequestException('ไม่มีคำถามช่องนี้');
      }

      const find_question =
        splitted_board[payload.row][payload.column] || null;
      if (!find_question) throw new BadRequestException('ไม่พบคำถาม');
      if (find_question.is_checked) {
        throw new BadRequestException('คำถามนี้ถูกตรวจสอบแล้ว');
      }
      const soph = await this.prismaService.member.findFirst({
        where: {
          unique_key: payload.key,
          role: MemberRole.SOPHOMORE,
        },
      });
      if (!soph) throw new BadRequestException('ไม่สามารถปลดล็อคได้');
      const new_board = splitted_board.map((row) => {
        return row.map((cell: QuestionDto) => {
          if (cell.question === find_question.question) {
            return { ...cell, is_checked: true };
          }
          return cell;
        });
      });
      await this.prismaService.member.update({
        where: { id: member.id },
        data: {
          bingo_board: new_board.flat(),
          bingo_member_list: { push: payload.key },
        },
      });
      return {
        message: 'ปลดล็อคสำเร็จ',
      };
    } catch (error) {
      throw error;
    }
  }

  public async submitBingo(member_: ValidateMemberDto) {
    try {
      const member = await this.prismaService.member.findFirst({
        where: { id: member_.id },
      });
      if (!member) {
        throw new BadRequestException('ไม่พบผู้ใช้');
      }

      if (!member.bingo_board) {
        throw new BadRequestException('กรุณาติดต่อเจ้าหน้าที่');
      }

      const splitted_board = this.split_chunk(member.bingo_board);

      const score = this.estimateScore(splitted_board);
      const new_board = this.shuffleArray(
        this.shuffleArray(this.bingoPayload),
      );
      if (score < 5)
        throw new BadRequestException(
          'ไม่สามารถส่งได้ต้องมี bingo อย่างต่ำ 5 ครั้ง',
        );

      const divide_ticket = Math.floor(score / 5);
      await this.prismaService.member.update({
        where: {
          id: member.id,
        },
        data: {
          bingo_board: new_board,
          ticket: {
            createMany: {
              data: this.generatePrize(divide_ticket),
            },
          },
        },
      });
      return {
        message: `ยินดีด้วยคุณได้รับตั๋ว ${divide_ticket} ใบ`,
        score: score,
      };
    } catch (error) {
      throw error;
    }
  }

  private estimateScore(payload: QuestionDto[][]): number {
    let score = 0;

    payload.forEach((row) => {
      if (row.every((cell) => cell.is_checked)) {
        score++;
      }
    });

    for (let col = 0; col < 4; col++) {
      let columnBingo = true;
      for (let row = 0; row < 4; row++) {
        if (!payload[row][col].is_checked) {
          columnBingo = false;
          break;
        }
      }
      if (columnBingo) {
        score++;
      }
    }

    let mainDiagonalBingo = true;
    for (let i = 0; i < 4; i++) {
      if (!payload[i][i].is_checked) {
        mainDiagonalBingo = false;
        break;
      }
    }
    if (mainDiagonalBingo) {
      score++;
    }

    let antiDiagonalBingo = true;
    for (let i = 0; i < 4; i++) {
      if (!payload[i][3 - i].is_checked) {
        antiDiagonalBingo = false;
        break;
      }
    }
    if (antiDiagonalBingo) {
      score++;
    }
    return score;
  }

  public async redeemTicket(
    body: PatchTicketDto,
    member_: ValidateMemberDto,
  ) {
    try {
      const ticket = await this.prismaService.ticket.findFirst({
        where: { id: body.ticket_id, member_id: member_.id },
      });
      if (!ticket) throw new NotFoundException('ไม่พบ ticket นี้');
      await this.prismaService.ticket.update({
        where: { id: ticket.id },
        data: { is_used: true },
      });
      return {
        message: 'ใช้ตั๋วสำเร็จ',
      };
    } catch (error) {
      throw error;
    }
  }
}
