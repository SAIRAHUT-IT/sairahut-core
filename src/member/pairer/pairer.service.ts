import { Injectable } from '@nestjs/common';
import { SophomoreService } from '../sophomore/sophomore.service';
import { FreshyService } from '../freshy/freshy.service';
import { MemberStatus } from 'src/interfaces/member.interface';

@Injectable()
export class PairerService {
  constructor(
    private readonly freshyService: FreshyService,
    private readonly sophomoreService: SophomoreService,
  ) {}

  public pairer() {
    const freshies = this.freshyService
      .getFreshies()
      .filter((e) => e.status === MemberStatus.UNPAIR);
    const sophomore = this.sophomoreService
      .getSophomore()
      .filter((e) => e.status === MemberStatus.UNPAIR)
      .reverse();
    freshies.forEach((std) => {
      const student = std;
      sophomore.forEach((soph) => {
        const filtered = soph.this_or_that.filter((el) =>
          student.this_or_that.includes(el),
        );
        if (
          filtered.length >= 1 &&
          !student.gay &&
          !soph.gay
        ) {
          this.freshyService.updateFreshy(student.id, soph);
          this.sophomoreService.updateSophomore(
            soph.id,
            student,
          );
          console.log(
            student.username,
            'with this_or_that',
            student.this_or_that,
            'status',
            student.status,
            'is paired with',
            soph.username,
            'with this_or_that',
            soph.this_or_that,
            'status',
            soph.status,
          );
        }
      });
    });

    return { freshies, sophomore };
  }
}
