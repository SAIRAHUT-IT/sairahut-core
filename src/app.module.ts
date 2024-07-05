import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FreshyModule } from './member/freshy/freshy.module';
import { SophomoreModule } from './member/sophomore/sophomore.module';
import { PairerModule } from './member/pairer/pairer.module';

@Module({
  imports: [FreshyModule, SophomoreModule, PairerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
