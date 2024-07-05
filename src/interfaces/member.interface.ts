export interface Member {
  id: number;
  username: string;
  reputation: number;
  role: MemberRole;
  status: MemberStatus;
  coins: number;
  this_or_that: string[];
  gay?: number;
}

export enum MemberRole {
  FRESHY = 'FRESHY',
  SEPHOMORE = 'SEPHOMORE',
}

export enum MemberStatus {
  PAIRED = 'PAIRED',
  UNPAIR = 'UNPAIR',
  FREEZE = 'FREEZE',
}
