import { Module } from '@nestjs/common';
import { ThisThatService } from './this-that.service';
import { ThisThatController } from './this-that.controller';
import { PrismaService } from 'src/libs/prisma';
import { JwtStrategy } from 'src/libs/auth/jwt.strategy';

@Module({
  controllers: [ThisThatController],
  providers: [ThisThatService, PrismaService, JwtStrategy],
})
export class ThisThatModule {}
