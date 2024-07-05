import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberRole,
} from 'src/interfaces/member.interface';

@Injectable()
export class SophomoreService {
  private sophomore: Member[] = [];
  constructor() {
    this.generateMockedData();
    console.log(this.sophomore);
  }

  private generateMockedData() {
    for (let index = 1; index <= 10; index++) {
      this.sophomore.push({
        id: index,
        username: `sophomore_${index}`,
        reputation: 10 + index,
        coins: 10,
        role: MemberRole.SEPHOMORE,
        this_or_that:
          index > 5
            ? ['FUNNY', 'NIGHT_RIDE']
            : ['SHY', 'SLEEPING'],
      });
    }
  }

  public getSophomore(): Member[] {
    return this.sophomore;
  }
}
