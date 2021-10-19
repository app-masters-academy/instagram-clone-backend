import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  id: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  github: string;

  @IsNotEmpty()
  name: string;

  token: string;

  registro: string;
}
