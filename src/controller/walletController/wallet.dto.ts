import {  IsNotEmpty } from 'class-validator';
export class walletDto{

  public walletAddress!: string;
  
  public walletAmount!: string;
  
  @IsNotEmpty()
  public currency!:string;
}