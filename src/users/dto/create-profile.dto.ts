import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsNumber()
  @IsOptional()
  age?: string;
}
