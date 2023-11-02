import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  lastname: string;

  @IsString()
  firstname: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
