
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public name: string | undefined;

  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  public password!: string;

  @IsNotEmpty()
  public phonenumber!: string;  

  
  public isAdmin!: boolean; 
}