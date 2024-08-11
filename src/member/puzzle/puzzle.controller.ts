import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PuzzleService } from './puzzle.service';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchPuzzle } from 'src/dtos/puzzle/puzzle.dto';

@ApiTags('PUZZLE')
@Controller('puzzle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PuzzleController {
  constructor(private readonly puzzleService: PuzzleService) {}

  @Patch()
  patchPuzzle(
    @Body() body: PatchPuzzle,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    return this.puzzleService.patchPuzzle(body, member);
  }

  @Get()
  getPuzzle(@MemberValidator() member: ValidateMemberDto) {
    return this.puzzleService.getPuzzle(member);
  }
}
