import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @Length(4, 30, { message: 'O nome precisa ter entre 4 e 30 caracteres' })
  readonly name: string;

  @Length(4, 20, { message: 'A senha precisa ter entre 4 e 20 caracteres' })
  readonly password: string;

  clientId: string;
}
