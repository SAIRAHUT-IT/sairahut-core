import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PuzzleService } from './puzzle.service';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('PUZZLE')
@Controller('puzzle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PuzzleController {
  constructor(private readonly puzzleService: PuzzleService) {}

  @Patch()
  patchPuzzle(@MemberValidator() member: ValidateMemberDto) {
    return this.puzzleService.patchPuzzle(member);
  }

  @Get()
  getPuzzle(@MemberValidator() member: ValidateMemberDto) {
    return this.puzzleService.getPuzzle(member);
  }
}
