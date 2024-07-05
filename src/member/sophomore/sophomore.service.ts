import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberRole,
  MemberStatus,
} from 'src/interfaces/member.interface';

@Injectable()
export class SophomoreService {
  private sophomore: Member[] = [];
  constructor() {
    this.generateMockedData();
  }

  private generateMockedData() {
    for (let index = 1; index <= 10; index++) {
      this.sophomore.push({
        id: index,
        username: `sophomore_${index}`,
        reputation: 10 + index,
        coins: 10,
        role: MemberRole.SEPHOMORE,
        status: MemberStatus.UNPAIR,
        this_or_that:
          index >= 5
            ? ['FUNNY', 'NIGHT_RIDE']
            : ['SHY', 'SLEEPING'],
      });
    }
  }

  public getSophomore(): Member[] {
    return this.sophomore;
  }

  public updateSophomore(
    id: number,
    paried: Member,
  ): Member {
    const index = this.sophomore.findIndex(
      (std) => std.id === id,
    );
    this.sophomore[index].status = MemberStatus.PAIRED;
    this.sophomore[index].gay = paried.id;
    return this.sophomore[index];
  }
}
