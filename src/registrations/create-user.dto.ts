import { CreatePersonDto } from './create-person.dto.js';

export class CreateUserDto extends CreatePersonDto {
  email!: string;
}
