import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PuzzleService } from './puzzle.service';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchPuzzle } from 'src/dtos/puzzle/puzzle.dto';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';

@ApiTags('PUZZLE')
@Controller('puzzle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PuzzleController {
  constructor(
    private readonly puzzleService: PuzzleService,
    private readonly httpService: HttpService,
  ) {}

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

  @Get('image')
  async getPuzzleImage(
    @Res() res: Response,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    try {
      const imageUrl = await this.puzzleService.getPuzzleImage(
        member,
      );

      const response = await this.httpService
        .get(imageUrl, { responseType: 'arraybuffer' })
        .toPromise();

      const buffer = Buffer.from(response.data, 'binary');
      const base64Image = buffer.toString('base64');
      const mimeType = 'image/webp';

      res.send({ image: `data:${mimeType};base64,${base64Image}` });
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Failed to load image.');
    }
  }
}
