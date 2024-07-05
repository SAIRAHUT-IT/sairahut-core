import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberRole,
  MemberStatus,
} from 'src/interfaces/member.interface';

@Injectable()
export class FreshyService {
  private freshies: Member[] = [];
  constructor() {
    this.generateMockedData();
  }

  private generateMockedData() {
    for (let index = 1; index <= 10; index++) {
      this.freshies.push({
        id: index,
        username: `freshy_${index}`,
        reputation: 10 + index,
        coins: 10,
        role: MemberRole.FRESHY,
        status: MemberStatus.UNPAIR,
        this_or_that:
          index >= 5
            ? ['FUNNY', 'NIGHT_RIDE']
            : ['SHY', 'SLEEPING'],
      });
    }
  }

  public getFreshies(): Member[] {
    return this.freshies;
  }

  public updateFreshy(id: number, paried: Member): Member {
    const index = this.freshies.findIndex(
      (std) => std.id === id,
    );
    this.freshies[index].status = MemberStatus.PAIRED;
    this.freshies[index].gay = paried.id;
    return this.freshies[index];
  }
}
