import { IsNotEmpty, IsEmail, IsString, isNotEmpty } from 'class-validator';
export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
