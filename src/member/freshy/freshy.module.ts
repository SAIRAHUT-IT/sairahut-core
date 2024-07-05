import { Module } from '@nestjs/common';
import { FreshyService } from './freshy.service';
import { FreshyController } from './freshy.controller';

@Module({
  controllers: [FreshyController],
  providers: [FreshyService],
})
export class FreshyModule {}
