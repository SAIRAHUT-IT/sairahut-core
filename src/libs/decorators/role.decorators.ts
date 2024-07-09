import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '@prisma/client';

export const ROLES_KEY = 'webtermrolekey';
export const Role = (...roles: MemberRole[]) =>
  SetMetadata(ROLES_KEY, roles);
