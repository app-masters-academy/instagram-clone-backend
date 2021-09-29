import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @Length(4, 30)
  readonly name: string;

  @Length(4, 20)
  readonly password: string;
}
