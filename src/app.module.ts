import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FreshyModule } from './member/freshy/freshy.module';
import { SophomoreModule } from './member/sophomore/sophomore.module';
import { PairerModule } from './member/pairer/pairer.module';
import { CodeHuntModule } from './member/code-hunt/code-hunt.module';
import { AuthModule } from './member/auth/auth.module';
import { PrismaService } from './libs/prisma';

@Module({
  imports: [
    FreshyModule,
    SophomoreModule,
    PairerModule,
    CodeHuntModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
