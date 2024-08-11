import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class PuzzleService {
  constructor(private prismaService: PrismaService) {}
}
