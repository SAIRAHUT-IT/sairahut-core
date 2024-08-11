import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FreshyModule } from './member/freshy/freshy.module';
import { SophomoreModule } from './member/sophomore/sophomore.module';
import { PairerModule } from './member/pairer/pairer.module';
import { CodeHuntModule } from './member/code-hunt/code-hunt.module';
import { AuthModule } from './member/auth/auth.module';
import { BingoModule } from './member/bingo/bingo.module';
import { ThisThatModule } from './member/this-that/this-that.module';
import { PuzzleModule } from './member/puzzle/puzzle.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FreshyModule,
    SophomoreModule,
    PairerModule,
    CodeHuntModule,
    AuthModule,
    BingoModule,
    ThisThatModule,
    PuzzleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
