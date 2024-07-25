import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // The parse method directly returns the validated data
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(
        error.errors || 'Validation failed',
      );
    }
  }
}
