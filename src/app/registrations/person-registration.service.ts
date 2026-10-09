import { BadRequestException } from '@nestjs/common';
import { CreatePersonDto } from './create-person.dto.js';

export abstract class PersonRegistrationService<
  TInput extends CreatePersonDto,
  TResult,
> {
  abstract create(input: TInput): Promise<TResult>;

  protected personData(input: CreatePersonDto) {
    if (
      !input ||
      typeof input.name !== 'string' ||
      input.name.trim().length === 0
    ) {
      throw new BadRequestException('name is required');
    }

    if (
      input.cpf !== undefined &&
      input.cpf !== null &&
      (typeof input.cpf !== 'string' || input.cpf.length > 11)
    ) {
      throw new BadRequestException('cpf must contain at most 11 characters');
    }

    return {
      name: input.name.trim(),
      cpf: input.cpf?.trim() || null,
    };
  }
}
