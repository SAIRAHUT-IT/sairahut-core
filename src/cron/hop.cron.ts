import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GuessService } from 'src/member/guess/guess.service';

@Injectable()
export class HopCron {
  private readonly logger = new Logger(HopCron.name);

  constructor(private readonly guessService: GuessService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async hopper() {
    try {
      for (const [elemental, currentHop] of Object.entries(
        this.guessService.hop_current,
      )) {
        const current_list = this.guessService.hop_list[elemental];
        const availableHops = current_list.filter(
          (hop) => hop !== currentHop,
        );

        const randomValue =
          availableHops[
            Math.floor(Math.random() * availableHops.length)
          ];

        if (randomValue !== undefined) {
          //   console.log(
          //     `Updating ${elemental} from ${currentHop} to ${randomValue}`,
          //   );
          this.guessService.hop_current[elemental] = randomValue;
        }
      }

      this.guessService.current_hop += 1;

      //    Log the updated hop_current state
      //   console.log(
      //     'Updated hop_current:',
      //     this.guessService.hop_current,
      //   );
    } catch (error) {
      this.logger.error('Error in hopper:', error);
    }
  }
}
