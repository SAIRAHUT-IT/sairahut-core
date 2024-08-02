import { Module } from '@nestjs/common';
import { CodeHuntService } from './code-hunt.service';
import { CodeHuntController } from './code-hunt.controller';
import { PrismaService } from 'src/libs/prisma';
import { ThrottlerModule } from '@nestjs/throttler';
import { RolesGuard } from 'src/libs/auth/role.guard';
import { JwtStrategy } from 'src/libs/auth/jwt.strategy';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
  ],
  controllers: [CodeHuntController],
  providers: [
    CodeHuntService,
    PrismaService,
    RolesGuard,
    JwtStrategy,
  ],
})
export class CodeHuntModule {}
