export interface Member {
  id: number;
  username: string;
  reputation: number;
  role: MemberRole;
  coins: number;
  this_or_that: string[];
}

export enum MemberRole {
  FRESHY,
  SEPHOMORE,
}
