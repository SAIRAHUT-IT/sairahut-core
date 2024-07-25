import { Injectable } from '@nestjs/common';
import { BingoPayloadDto } from 'src/dtos/bingo/bingo.dto';

@Injectable()
export class BingoService {
  constructor() {}

  public async validateBingoPayload(
    payload: BingoPayloadDto,
  ): Promise<number> {
    // const x = [
    //   [
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: true },
    //   ],
    //   [
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: true },
    //   ],
    //   [
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: true },
    //   ],
    //   [
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: true },
    //     { is_checked: false },
    //   ],
    // ];

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
}
