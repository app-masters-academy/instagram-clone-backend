import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClientSheetDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  github: string;

  @IsNotEmpty()
  name: string;
}
