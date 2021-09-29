import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClientSheetDto {
  id: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  github: string;

  @IsNotEmpty()
  name: string;
}
