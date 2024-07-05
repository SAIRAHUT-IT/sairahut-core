import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberRole,
} from 'src/interfaces/member.interface';

@Injectable()
export class FreshyService {
  private freshies: Member[] = [];
  constructor() {
    this.generateMockedData();
    console.log(this.freshies);
  }

  private generateMockedData() {
    for (let index = 1; index <= 10; index++) {
      this.freshies.push({
        id: index,
        username: `freshy_${index}`,
        reputation: 10 + index,
        coins: 10,
        role: MemberRole.FRESHY,
        this_or_that:
          index > 5
            ? ['FUNNY', 'NIGHT_RIDE']
            : ['SHY', 'SLEEPING'],
      });
    }
  }

  public getFreshies(): Member[] {
    return this.freshies;
  }
}
