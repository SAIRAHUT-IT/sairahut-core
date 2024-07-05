import { Module } from '@nestjs/common';
import { SophomoreService } from './sophomore.service';
import { SophomoreController } from './sophomore.controller';

@Module({
  controllers: [SophomoreController],
  providers: [SophomoreService]
})
export class SophomoreModule {}
